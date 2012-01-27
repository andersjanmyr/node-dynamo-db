var vows = require('vows'),
    assert = require('assert');

var Sts = require('../lib/dynamo-db').Sts;

var access = process.env['AWS_KEY'];
var secret = process.env['AWS_SECRET'];

var sts = new Sts({
  access: access,
  secret: secret
});

vows.describe('Session Token Service').addBatch({
  'getSessionToken': {
    topic: function() { sts.getSessionToken(this.callback); },
    'returns a valid session token': function(err, token) {
      assert.isNull(err);
      assert.isNotNull(token);
    }
  }

}).export(module);


