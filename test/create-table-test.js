var vows = require('vows'),
    assert = require('assert');

var DynamoDB = require('dynamo-db');
var db = new DynamoDB({key: process.env['S3_KEY']});

vows.describe('DynamoDB').addBatch({
  'when calling createHeaders with an operation': { 
    topic: db.createHeaders({ op: 'CreateTable'}),

    'we get an header object back': function(topic) {
      console.log(topic);
      assert.isNotNull(topic);
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


