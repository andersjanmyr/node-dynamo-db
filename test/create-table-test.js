var vows = require('vows'),
    assert = require('assert');

var db = require('dynamo-db');

vows.describe('Create Table').addBatch({
  'when calling createTable with no arguments': { 
    topic: db.createTable(),

    'we get an exception': function(topic) {
    }
  }
});


