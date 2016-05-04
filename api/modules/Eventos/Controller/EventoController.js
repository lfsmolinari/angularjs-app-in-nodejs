var EventoModel = require('../Model/EventoModel');
var Promise = require('bluebird');

function EventoController(Model){
    this.Model = Promise.promisifyAll(Model);
}

EventoController.prototype.findAllEntrega = function(req,res){
    this.Model.findAllEntregaAsync()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
      res.json(err);
    });
}

EventoController.prototype.findAllRetirada = function(req,res){
    this.Model.findAllRetiradaAsync()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
      res.json(err);
    });
}


EventoController.prototype.create = function(req, res) {
  var data = req.body;
  var resp = { Mensagem:'', Success: true };
  this.Model.createAsync(data)
    .then(function(result) {
      res.json(resp);
    })
    .catch(function(err) {
      console.log(err.message);
      resp.Success = false;
      resp.Mensagem = err.message;
      res.json(resp);
    });
};


EventoController.prototype.endEvent = function(req, res) {
  var data = req.body;
  var resp = { Mensagem:'', Success: true };
  //console.log(req.params.id, data);
  this.Model.endEventAsync(data, req.params.id)
    .then(function(result) {
      console.log('result: ', result);
      res.json(resp);
    })
    .catch(function(err) {
      console.log("Err: ", err.message);
      resp.Success = false;
      resp.Mensagem = err.message;
      res.json(resp);
    });
};



EventoController.prototype.findOne = function(req, res) {
  this.Model.findOneAsync(req.params.id)
    .then(function(result) {
      console.log('result: ', result);
      res.json(result);
    })
    .catch(function(err) {
      res.json(err);
    });
};

module.exports = new EventoController(EventoModel);
