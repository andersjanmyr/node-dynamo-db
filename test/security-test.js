var vows = require('vows'),
    assert = require('assert');

var Security = require('dynamo-db').Security;
var security = new Security({
  access: process.env['S3_KEY'],
  secret: process.env['S3_SECRET']
});

vows.describe('Security').addBatch({
  'when I sign a string with key': { 
    topic: security.sign('String', 'KEY'),

    'I get a signed digest': function(topic) {
      assert.deepEqual(topic, 'pjGpSSOMgmXjnn09HB5ednV6F4tCyIUSEom3ObLqEro=');
    }
  },
  'toCanonicalForm': { 
    topic: security.toCanonicalForm({
    'Action': 'GetSession',
    'Signature': 2,
    'AWSAccessKeyID': 'secret'
    }),

    'is a sorted query string': function(topic) {
      var expected = 'AWSAccessKeyID=secret&Action=GetSession&Signature=2';
      assert.equal(topic, expected);
    }
  },
  'toCanonicalRequest': { 
    topic: security.toCanonicalRequest('GET', 'iam.amazonaws.com', {
    'Action': 'GetSession',
    'Signature': 2,
    'AWSAccessKeyID': 'secret'
    }),

    'is a proper request': function(topic) {
      var expected = 'GET\niam.amazonaws.com\n/\nAWSAccessKeyID=secret&Action=GetSession&Signature=2';
      assert.equal(topic, expected);
    }
  },
  'signRequest': { 
    topic: security.signRequest('GET', 'iam.amazonaws.com', {
    'Action': 'GetSession',
    'Version': 2,
    'AWSAccessKeyID': 'secret'
    }),

    'is a proper request': function(topic) {
      var expected = new RegExp('GET\niam.amazonaws.com\n/\nAWSAccessKeyID=secret&Action=GetSession&Signature=.+&Version=2');
      console.log(topic);
      assert.matches(topic, expected);
    }
  }
}).export(module);

