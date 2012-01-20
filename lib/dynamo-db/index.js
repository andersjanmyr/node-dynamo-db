
var request = require('request');

exports.version = '0.0.1';


function DynamoDB(options) {
  this.options = options;
}

DynamoDB.prototype.createHeaders = function() {
};


DynamoDB.prototype.createHeaders = function() {
  return {
    host: 'dynamodb.us-east-1.amazonaws.com',
    'x-amz-date': new Date(),
    'x-amzn-authorization': this.options['key'],
    'x-amz-target': 'DynamoDB_20111205.CreateTable',
    'x-amz-security-token': '*Token Value*'
  };


};
DynamoDB.prototype.createTable = function(options, callback) {
  if (!options.name)  callback('name and primaryKey are required');
};

module.exports = DynamoDB;




