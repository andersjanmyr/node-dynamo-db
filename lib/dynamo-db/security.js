
var crypto = require('crypto');
var _ = require('underscore');
var qs = require("querystring");

function Security(options) {
  this.options = options;
}

mod = Security.prototype;

mod.sign = function(string, key) {
   var hmac = crypto.createHmac('sha256', key);
   hmac.update(string);
   return hmac.digest('base64');
};

mod.toCanonicalForm = function(params) {
  var keys = Object.keys(params).sort()
  return keys.map(function(key) {
    return key + '=' + encodeURIComponent(params[key]);
  }).join('&');
};

mod.toCanonicalRequest= function(type, host, params) {
  return type + '\n' +
    host + '\n' +
    '/' + '\n' +
    this.toCanonicalForm(params);
};

mod.signRequest = function(type, host, params) {
  return {'Signature': this.sign(type, host, params) }; 
};


mod.authorizationKey = function(key) {
  return 'AWS3 AWSAccessKeyId=' + key + ',Algorithm=HmacSHA256';
};

module.exports=Security

