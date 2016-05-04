var async = require('async');
//var mysql = require('../../DB/mysql');
var mongo = require('../../DB/mongo');
function MaterialModel(){

}

MaterialModel.prototype.findAll = function(callback){
    mongo.collection('MaterialColetado').find({}, callback);
}

MaterialModel.prototype.remove = function(id, callback){
  mongo.collection('MaterialColetado').remove({ _id: mongo.ObjectId(id) }, callback);
}

MaterialModel.prototype.create = function(data, callback){
  mongo.collection('MaterialColetado').save(data, callback);
}

module.exports = new MaterialModel();
