var mongojs = require('mongojs');
var db = mongojs('admin:i31eZR3iZ7GU@127.7.105.130:27017/interchange');
//var db = mongojs('admin:i31eZR3iZ7GU@localhost:6666/interchange');

module.exports = db;
