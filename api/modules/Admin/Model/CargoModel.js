var async = require('async');
//var mysql = require('../../DB/mysql');
var mongo = require('../../DB/mongo');
function CargoModel(){

}

CargoModel.prototype.findAll = function(callback){
    mongo.collection('Cargos').find({}, callback);
}

CargoModel.prototype.remove = function(id, callback){
  mongo.collection('Cargos').remove({ _id: mongo.ObjectId(id) }, callback);
}

CargoModel.prototype.create = function(data, callback){
  var cargo = { Descricao: data.Descricao};
  mongo.collection('Cargos').save(data, callback);
}

module.exports = new CargoModel();
