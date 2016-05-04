var async = require('async');
//var mysql = require('../../DB/mysql');
var mongo = require('../../DB/mongo');

function PessoaModel(){

}


PessoaModel.prototype.findAll = function(callback){
    mongo.collection('Pessoas').find({}, callback);
}

PessoaModel.prototype.findOne = function(id, callback){
  console.log(id);
	mongo.collection('Pessoas').findOne({ _id: mongo.ObjectId(id) }, callback);
}

PessoaModel.prototype.create = function(data, callback){
	data.IsCliente = data.IsCliente === undefined ? false : data.IsCliente;
	data.IsFornecedor = data.IsFornecedor === undefined ? false : data.IsFornecedor;
	mongo.collection('Pessoas').save(data, callback);
}

PessoaModel.prototype.update = function(data, id, callback){
	data.IsCliente = data.IsCliente === undefined ? false : data.IsCliente;
	data.IsFornecedor = data.IsFornecedor === undefined ? false : data.IsFornecedor;
	delete data._id;
  console.log(id);
	mongo.collection('Pessoas').update({ _id: mongo.ObjectId(id) }, { $set: data }, callback);
}

PessoaModel.prototype.findAllCustomer = function(callback){
    mongo.collection('Pessoas').find({ IsCliente : true}, callback);
}

PessoaModel.prototype.findByCpfCnpj = function(cpf, cnpj, callback){
	mongo.collection('Pessoas').find({
 		$or: [{ CPF: cpf.toString() }, {CNPJ: cnpj.toString()} ]
   	}, callback);
}

PessoaModel.prototype.findCustomerByNomeCpfCnpj = function(nome, cpf, cnpj, callback){
	//var query = 'SELECT * FROM Pessoas  Where IsCliente = 1 ',
  var searchNome = new RegExp(".*" + nome + ".*");
	mongo.collection('Pessoas').find({
	   IsCliente : true,
     $or: [{ Nome: searchNome }, { CPF: cpf.toString() }, {CNPJ: cnpj.toString()} ]
 	}, callback);
}

PessoaModel.prototype.findAllSupplier = function(callback){
    mongo.collection('Pessoas').find({ IsFornecedor : true}, callback);
}

PessoaModel.prototype.findSupplierByNomeCpfCnpj = function(nome, cpf, cnpj, callback){
	//var query = 'SELECT * FROM Pessoas  Where IsFornecedor = 1 ',
  var searchNome = new RegExp(".*" + nome + ".*");
	mongo.collection('Pessoas').find({
    IsFornecedor : true,
 		$or: [{ Nome: searchNome}, { CPF: cpf.toString() }, {CNPJ: cnpj.toString()} ]
 	}, callback);
}

function boolCast (field, next) {
	if (field.type == 'TINY' && field.length == 1) {
	  return (field.string() == '1'); // 1 = true, 0 = false
	}
	return next();
}

module.exports = new PessoaModel();
