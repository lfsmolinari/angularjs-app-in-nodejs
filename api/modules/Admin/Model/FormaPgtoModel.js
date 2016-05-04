var async = require('async');
//var mysql = require('../../DB/mysql');
var mongo = require('../../DB/mongo');
function FormaPgtoModel(){

}

FormaPgtoModel.prototype.findAll = function(callback){
    mongo.collection('FormaPagamentos').find({}, callback);
}

FormaPgtoModel.prototype.remove = function(id, callback){
  mongo.collection('FormaPagamentos').remove({ _id: mongo.ObjectId(id) }, callback);
}

FormaPgtoModel.prototype.create = function(data, callback){
  mongo.collection('FormaPagamentos').save(data, callback);
}

module.exports = new FormaPgtoModel();
