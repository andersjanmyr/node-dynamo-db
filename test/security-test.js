var vows = require('vows'),
    assert = require('assert');

var Security = require('dynamo-db').Security;

var access = process.env['S3_KEY'];
var secret = process.env['S3_SECRET'];

var security = new Security({
  access: access,
  secret: secret
});

vows.describe('Security').addBatch({
  'when I sign a string with key': { 
    topic: security.sign('String', 'KEY'),

    'I get a signed digest': function(topic) {
      assert.deepEqual(topic, 'pjGpSSOMgmXjnn09HB5ednV6F4tCyIUSEom3ObLqEro=');
    }
  },
  'timestamp': {
    topic: security.timestamp(),
    'conforms to ISO 8601': function(topic) {
      assert.matches(topic, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    }
  },
  'defaultParams': {
    topic: security.defaultParams(),
    'includes Version, Timestamp, SignatureVersion and SignatureMethod': function(topic) {
      assert.equal(topic.AWSAccessKeyId, access);
      assert.equal(topic.Version, '2010-05-08');
      assert.isNotNull(topic.Timestamp);
      assert.equal(topic.SignatureVersion, 2);
      assert.equal(topic.SignatureMethod, 'HmacSHA256');
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
    topic: security.toCanonicalRequest('GET', 'iam.amazonaws.com', '/', {
    'Action': 'GetSession',
    'Signature': 2,
    'AWSAccessKeyID': 'secret'
    }),

    'is a proper request': function(topic) {
      var expected = 'GET\niam.amazonaws.com\n/\nAWSAccessKeyID=secret&Action=GetSession&Signature=2';
      assert.equal(topic, expected);
    }
  },
  'signedParams': { 
    topic: security.signedParams('GET', 'iam.amazonaws.com', '/', {
    'Action': 'GetSession',
    'Version': 2,
    'AWSAccessKeyID': 'secret'
    }),

    'includes a Signature param': function(topic) {
      assert.include(topic, 'Signature');
    }
  },
  'url': {
    topic: security.url('host', '/', {a: 'b'}),
    'returns a proper https url': function(topic) {
      assert.equal(topic, 'https://host/?a=b');
    }
  },

  'getSessionToken': {
    topic: function() { security.getSessionToken(this.callback); },
    'returns a valid session token': function(topic, err, token) {
      console.log(err, token);
      assert.isNull(err);
      assert.isNotNull(token);
    }
  }

}).export(module);

