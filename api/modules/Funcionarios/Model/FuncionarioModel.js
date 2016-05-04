var async = require('async');
//var mysql = require('../../DB/mysql');
var mongo = require('../../DB/mongo');

function FuncionarioModel(){

}

FuncionarioModel.prototype.findAll = function(callback){
    mongo.collection('Funcionarios').find({}, callback);
}

FuncionarioModel.prototype.findByNomeCpf = function(nome, cpf, callback){
  var searchNome = new RegExp(".*" + nome + ".*");
  console.log(searchNome);
	mongo.collection('Funcionarios').find({
 		$or: [ { Nome: searchNome}, { CPF: cpf.toString()} ]
   	}, callback);
}

FuncionarioModel.prototype.findOne = function(id, callback){
	mongo.collection('Funcionarios').findOne({ _id: mongo.ObjectId(id) }, callback);
}

FuncionarioModel.prototype.create = function(data, callback){
	data.IsCLT = data.IsCLT === undefined ? false : data.IsCLT;
	data.HasVR = data.HasVR === undefined ? false : data.HasVR;
	data.HasVT = data.HasVT === undefined ? false : data.HasVT;
	mongo.collection('Funcionarios').save(data, callback);
}

FuncionarioModel.prototype.update = function(data, id, callback){
	data.IsCLT = data.IsCLT === undefined ? false : data.IsCLT;
	data.HasVR = data.HasVR === undefined ? false : data.HasVR;
	data.HasVT = data.HasVT === undefined ? false : data.HasVT;
	delete data._id;
	mongo.collection('Funcionarios').update({ _id: mongo.ObjectId(id) }, { $set: data }, callback);
}

function boolCast (field, next) {
	if (field.type == 'TINY' && field.length == 1) {
	  return (field.string() == '1'); // 1 = true, 0 = false
	}
	return next();
}

module.exports = new FuncionarioModel();
