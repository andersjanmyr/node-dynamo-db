var vows = require('vows'),
    assert = require('assert');

var Security = require('dynamo-db').Security;

var access = process.env['S3_KEY'];
var secret = process.env['S3_SECRET'];

var security = new Security({
  access: access,
  secret: secret
});

vows.describe('Session Token Service').addBatch({
  'getSessionToken': {
    topic: function() { security.getSessionToken(this.callback); },
    'returns a valid session token': function(err, token) {
      assert.isNull(err);
      assert.isNotNull(token);
    }
  }

}).export(module);


