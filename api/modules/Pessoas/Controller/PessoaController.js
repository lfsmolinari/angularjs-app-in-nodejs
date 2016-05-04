var PessoaModel = require('../Model/PessoaModel');
var Promise = require('bluebird');

function PessoaController(Model){
    this.Model = Promise.promisifyAll(Model);
}

PessoaController.prototype.create = function(req, res) {
  var data = req.body;
  var resp = { Mensagem:'', Success: true };
  this.Model.createAsync(data)
    .then(function(result) {
      console.log(result[0]);
      resp.Model = result[0];
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

PessoaController.prototype.update = function(req, res) {
  //console.log('update');
  var data = req.body;
  var resp = { Mensagem:'', Success: true };
  this.Model.updateAsync(data, req.params.id)
    .then(function(result) {
      //console.log('update Success');
      res.json(resp);
    })
    .catch(function(err) {
      console.log(err.message);
      resp.Success = false;
      resp.Mensagem = err.message;

      res.json(resp);
    });
};

PessoaController.prototype.findAll = function(req,res){
    this.Model.findAllAsync()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}

PessoaController.prototype.findOne = function(req,res){
    this.Model.findOneAsync(req.params.id)
    .then(function(result) {
      res.json(result || []);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}

PessoaController.prototype.findByCpfCnpj = function(req,res){
  var cpf  = req.params.cpf,
      cnpj = req.params.cnpj;

  this.Model.findByCpfCnpjAsync(cpf,cnpj)
  .then(function(result) {
    console.log(result);
    res.json(result[0] || null);
  })
  .catch(function(err) {
    console.log(err);
    res.json(null);
  });
}

PessoaController.prototype.findAllCustomer = function(req,res){
    this.Model.findAllCustomerAsync()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}

PessoaController.prototype.findCustomerByNomeCpfCnpj = function(req,res){
    var nome =  req.params.nome,
        cpf  = req.params.cpf,
        cnpj = req.params.cnpj;
      if(nome === "0" && cpf === "0" && cnpj === "0"){
        nome = "";
        cpf = "";
        cnpj = "";
      }
    this.Model.findCustomerByNomeCpfCnpjAsync(nome,cpf,cnpj)
    .then(function(result) {
      res.json(result || []);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}

PessoaController.prototype.findAllSupplier = function(req,res){
    this.Model.findAllSupplierAsync()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}

PessoaController.prototype.findSupplierByNomeCpfCnpj = function(req,res){
  var nome =  req.params.nome,
      cpf  = req.params.cpf,
      cnpj = req.params.cnpj;
    if(nome === "0" && cpf === "0" && cnpj === "0"){
      nome = "";
      cpf = "";
      cnpj = "";
    }

    this.Model.findSupplierByNomeCpfCnpjAsync(nome,cpf,cnpj)
    .then(function(result) {
      res.json(result || []);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}
module.exports = new PessoaController(PessoaModel);
