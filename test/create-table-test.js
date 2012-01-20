var vows = require('vows'),
    assert = require('assert');

var DynamoDB = require('dynamo-db');
var db = new DynamoDB({
  access: process.env['S3_KEY'],
  secret: process.env['S3_SECRET']
});

vows.describe('AWS Identity').addBatch({
  'signRequest': { 
    topic: db.signRequest('GET', 'sts.amazonaws.com', {}),

    'is an object with key Signature': function(topic) {
      assert.deepEqual(topic, { 'Signature': 'XXXXXXGETsts.amazonaws.com'});
    }
  }
}).export(module);

vows.describe('DynamoDB').addBatch({
  'authorizationKey': { 
    topic: db.authorizationKey('KKK'),

    'is a string with key and algorithm': function(topic) {
      assert.equal(topic, 'AWS3 AWSAccessKeyId=KKK,Algorithm=HmacSHA256');
    }
  },

  'when calling createHeaders with an operation': { 
    topic: db.createHeaders({ op: 'CreateTable'}),

    'we get an x-amz-target header': function(topic) {
      console.log(topic);
      assert.equal(topic['x-amz-target'],  'DynamoDB_20111205.CreateTable');
    }
  },

  'when calling createTable with no arguments': { 
    topic: function() {
      db.createTable({}, this.callback);
    },

    'we get an exception': function(err, res) {
      assert.isNotNull(err);
      assert.isUndefined(res);
    }
  }
}).export(module);


