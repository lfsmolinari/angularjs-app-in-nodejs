var FuncionarioModel = require('../Model/FuncionarioModel');
var Promise = require('bluebird');

function FuncionarioController(Model){
    this.Model = Promise.promisifyAll(Model);
}

FuncionarioController.prototype.findAll = function(req,res){
    this.Model.findAllAsync()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}

FuncionarioController.prototype.findByNomeCpf = function(req,res){
	var nome = req.params.nome,
    	cpf  = req.params.cpf ;
  if(nome === "0" && cpf === "0"){
    nome = "";
    cpf = "";
  }
    this.Model.findByNomeCpfAsync(nome, cpf)
    .then(function(result) {
      res.json(result || []);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}

FuncionarioController.prototype.findOne = function(req,res){
    this.Model.findOneAsync(req.params.id)
    .then(function(result) {
      res.json(result || []);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}

FuncionarioController.prototype.create = function(req, res) {
  var data = req.body;
  var resp = { Mensagem:'', Success: true };
  this.Model.createAsync(data)
    .then(function(result) {
      res.json(resp);
    })
    .catch(function(err) {
      console.log(err.message);
      resp.Success = false;
      if(err.errno === 1062){
        resp.Mensagem = "CPF/CNPJ já existente \n\b" + err.message;
      }
      else{
        resp.Mensagem = err.message;
      }
      res.json(resp);
    });
};

FuncionarioController.prototype.update = function(req, res) {
  var data = req.body;
  var resp = { Mensagem:'', Success: true };

  this.Model.updateAsync(data, req.params.id)
    .then(function(result) {
      res.json(resp);
    })
    .catch(function(err) {
      console.log("Err: ", err.message);
      resp.Success = false;
      resp.Mensagem = err.message;
      res.json(resp);
    });
};

module.exports = new FuncionarioController(FuncionarioModel);
