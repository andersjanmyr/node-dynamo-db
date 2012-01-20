
exports.version = '0.0.1';

function DynamoDb(options) {

}

DynamoDb.prototype.createTable = function(options, callback) {
  if (!options.name)  callback('name and primaryKey are required'); 
};

module.exports = DynamoDb;




