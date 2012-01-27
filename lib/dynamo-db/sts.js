
var xml2js = require('xml2js');
var Security = require('./security');

function Sts(options) {
  this.options = options;
  this.security = new Security(options);
}

mod = Sts.prototype;

mod.getSessionToken = function(callback) {
  var parser = new xml2js.Parser();
  this.security.makeRequest('GET', 'sts.amazonaws.com', '/', {
    Action: 'GetSessionToken'
  }, function(err, xml) {
    if (err) return callback(err);
    return parser.parseString(xml, function(err, data) {
      return callback(null, data.GetSessionTokenResult.Credentials);
    });
  });
};

module.exports = Sts;
