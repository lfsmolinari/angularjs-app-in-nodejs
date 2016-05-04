var MaterialModel = require('../Model/MaterialModel');
var Promise = require('bluebird');

function MaterialController(Model){
    this.Model = Promise.promisifyAll(Model);
}

MaterialController.prototype.findAll = function(req,res){
    this.Model.findAllAsync()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
      res.json(err);
    });
}

MaterialController.prototype.create = function(req, res) {
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

MaterialController.prototype.remove = function(req,res){
  var id =req.params.id;
  var resp = { Mensagem:'', Success: true };

  this.Model.removeAsync(id)
  .then(function(result) {
    res.json(resp);
  })
  .catch(function(err) {
    console.log(err);
    resp.Success = false;
    if(err.errno === 1451){
      resp.Mensagem = "Existem funcionários atrelados a esse cargo. Para deletá-lo favor retirar todas as referências ao mesmo. \n\b" + err.message;
    }
    else{
      resp.Mensagem = err.message;
    }

    res.json(resp);
  });
}

module.exports = new MaterialController(MaterialModel);
