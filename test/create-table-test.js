var vows = require('vows'),
    assert = require('assert');

var DynamoDB = require('dynamo-db');
var db = new DynamoDB();

vows.describe('Create Table').addBatch({
  'when calling createTable with no arguments': { 
    topic: db.createTable('name', 'key', {}, this.callback),

    'we get an exception': function(err, res) {
      assertIsNotNull(err);
    }
  }
});


