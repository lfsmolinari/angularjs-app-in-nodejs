var PedidoModel = require('../Model/PedidoModel');
var Promise = require('bluebird');

function PedidoController(Model){
    this.Model = Promise.promisifyAll(Model);
}

PedidoController.prototype.findAll = function(req,res){
    this.Model.findAllAsync()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
      res.json(err);
    });
}

PedidoController.prototype.findOne = function(req,res){
    this.Model.findOneAsync(req.params.id)
    .then(function(result) {
      res.json(result || []);
    })
    .catch(function(err) {
      console.log(err);
      res.json([]);
    });
}

PedidoController.prototype.create = function(req, res) {
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

PedidoController.prototype.remove = function(req,res){
  var id =req.params.id;
  var resp = { Mensagem:'', Success: true };

  this.Model.removeAsync(id)
  .then(function(result) {
    res.json(resp);
  })
  .catch(function(err) {
    console.log(err);
    resp.Success = false;
    resp.Mensagem = err.message;
    res.json(resp);
  });
}

PedidoController.prototype.update = function(req, res) {
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
PedidoController.prototype.GetCodigoPedido = function(req, res){
  var idGenerator = this.Model.idGeneratorAsync;
  this.Model.GetNextCodigoInteroAsync()
    .then(function(codigoInterno) {
      idGenerator(codigoInterno).then(function(result) {
        res.json(result);
      });
    });
}

module.exports = new PedidoController(PedidoModel);
