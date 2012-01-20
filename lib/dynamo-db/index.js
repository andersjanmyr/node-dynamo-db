
var request = require('request');
var _ = require('underscore');
var crypto = require('crypto');

exports.version = '0.0.1';


function DynamoDB(options) {
  this.options = options;
}

DynamoDB.prototype.sessionTokenRequest = function(duration, secret) {
  return 'GET\n' +
    'sts.amazonaws.com\n\n' +
    'AWSAccessKeyID=' + secret +
    '&Action=GetSessionToken' +
    '&DurationSeconds=' + duration +
  '&SignatureMethod=HmacSHA256' +
  '&SignatureVersion=2' +
  '&Timestamp=' + new Date() + 
  '&Version=2011-06-15';
};



DynamoDB.prototype.sign = function(key, type, host, params) {
   var hmac = crypto.createHmac('sha256', key);
   hmac.update(type + host);
   return hmac.digest('base64');
};

DynamoDB.prototype.signRequest = function(type, host, params) {
  return {'Signature': this.sign(type, host, params) }; 
};


DynamoDB.prototype.authorizationKey = function(key) {
  return 'AWS3 AWSAccessKeyId=' + key + ',Algorithm=HmacSHA256';
};


DynamoDB.prototype.createHeaders = function(options) {
  return {
    host: 'dynamodb.us-east-1.amazonaws.com',
    'x-amz-date': new Date(),
    'x-amz-authorization': this.authorizationKey(this.options.key),
    'x-amz-target': 'DynamoDB_20111205.' + options.op,
    'x-amz-security-token': '*Token Value*'
  };


};
DynamoDB.prototype.createTable = function(options, callback) {
  if (!options.name)  callback('name and primaryKey are required');
};

module.exports = DynamoDB;




