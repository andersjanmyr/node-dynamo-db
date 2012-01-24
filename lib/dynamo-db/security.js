
var crypto = require('crypto');
var _ = require('underscore');
var request = require("request");
var xml2js = require('xml2js');

function Security(options) {
  this.options = options;
}

mod = Security.prototype;

mod.sign = function(string, key) {
  if (!key) key = this.options.secret;
   var hmac = crypto.createHmac('sha256', key);
   hmac.update(string);
   return hmac.digest('base64');
};

mod.timestamp = function() {
  return (new Date).toJSON();
};

mod.defaultParams = function() {
  return {
    AWSAccessKeyId: this.options.access,
    Version: '2011-06-15',
    Timestamp: this.timestamp(),
    SignatureVersion: 2,
    SignatureMethod: 'HmacSHA256'
  };
};

mod.toCanonicalForm = function(params) {
  var keys = Object.keys(params).sort();
  return keys.map(function(key) {
    return key + '=' + encodeURIComponent(params[key]);
  }).join('&');
};

mod.toCanonicalRequest= function(method, host, path, params) {
  return method + '\n' +
    host + '\n' +
    path + '\n' +
    this.toCanonicalForm(params);
};

mod.signedParams = function(method, host, path, params) {
  var sign = this.sign(this.toCanonicalRequest(method, host, path, params));
  var obj = _.clone(params);
  obj.Signature = encodeURI(sign);
  return obj;
};

mod.url = function(host, path, params) {
  return 'https://' + host + path + '?' + this.toCanonicalForm(params);
};

mod.makeRequest = function(method, host, path, params, callback) {
  var extParams = _.extend({}, this.defaultParams(), params);
  var signedParams = this.signedParams(method, host, path, extParams);
  var url = this.url(host, path, signedParams);
  console.log(url,signedParams);
  return request({ method: method, url: url },
          function(err, resp, body) {
            if (err) return callback(err);
            return callback(null, body);
          });
};

mod.getSessionToken = function(callback) {
  var parser = new xml2js.Parser();
  this.makeRequest('GET', 'sts.amazonaws.com', '/', {
    Action: 'GetSessionToken'
  }, function(err, xml) {
    if (err) return callback(err);
    return parser.parseString(xml, function(err, data) {
      return callback(null, data.GetSessionTokenResult.Credentials);
    });
  });
};

mod.authorizationKey = function(key) {
  return 'AWS3 AWSAccessKeyId=' + key + ',Algorithm=HmacSHA256';
};

module.exports=Security

