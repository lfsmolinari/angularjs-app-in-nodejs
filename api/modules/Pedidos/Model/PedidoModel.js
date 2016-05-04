var async = require('async');
var string = require('string');
var Promise = require('bluebird');
//var mysql = require('../../DB/mysql');
var mongo = require('../../DB/mongo');
var TipoEventos = require('../../Helpers/TipoEventos');
var cliente = require('../../Module/ClienteModule');
function PedidoModel(cliente){
  this.Cliente =  Promise.promisifyAll(cliente);
}

PedidoModel.prototype.findAll = function(callback){
    mongo.collection('Pedidos').find({}, callback);
}

PedidoModel.prototype.findOne = function(id, callback){
	mongo.collection('Pedidos').findOne({ _id: mongo.ObjectId(id) }, callback);
}

PedidoModel.prototype.remove = function(id, callback){
  mongo.collection('Pedidos').remove({ _id: mongo.ObjectId(id) }, callback);
}

PedidoModel.prototype.create = function(data, callback){
  var idGenerator = this.idGenerator;
  this.GetNextCodigoIntero(function(err, codigoInterno){
    idGenerator(codigoInterno, function(err, codigoProduto){
        if (err) return callback(err);
        data.CodigoPedido = codigoProduto;
        data.CodigoInterno = codigoInterno;
        data.DataInclusao = new Date();
        mongo.collection('Pedidos').save(data, function(err, res){
          console.log(res);
          callback(err,res);
          mongo.collection('Eventos').save({ Pedido: res, TipoEvento: TipoEventos.get('Entrega'), DataInclusao: new Date()}, callback);
        });
    });
  });

}

PedidoModel.prototype.update = function(data, id, callback){
	delete data._id;
	mongo.collection('Pedidos').update({ _id: mongo.ObjectId(id) }, { $set: data }, callback);
}
PedidoModel.prototype.GetNextCodigoIntero = function(callback){
  console.log("Next Codigo Interno");
  mongo.collection('Counters').findAndModify(
          {
            query: { _id: 'Pedidos' },
            update: { $inc: { seq: 1 } },
            new: true
          },
          function(err, res){
            if (err) return callback(err);
            var codigoInterno = res.seq;
            console.log("mongo: ",codigoInterno);
            callback(null, codigoInterno);
          }
   );
}
PedidoModel.prototype.idGenerator = function(codigoInterno, callback){
  console.log("idGenerator");
  var d = new Date();
  console.log("callback result: ", codigoInterno);
  codigoInterno = string(codigoInterno + "").padLeft(6, '0').s
  console.log("codigoInterno: ", codigoInterno);
  var codigoProduto = "{{Ano}}.{{Mes}}.{{CodigoCliente}}.{{CodigoInterno}}";
  var codigoCliente = 1//TODO: receber como parametro e pensar em um jeito para aplicar para outros clientes;
  callback(null, string(codigoProduto).template({Ano: d.getFullYear(), Mes: string((d.getMonth()+1) +"").padLeft(2,'0'), CodigoCliente: codigoCliente, CodigoInterno: codigoInterno }).s);

}

module.exports = new PedidoModel(cliente);
