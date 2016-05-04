var async = require('async');
var mongo = require('../../DB/mongo');
var TipoEventos = require('../../Helpers/TipoEventos');

function EventoModel(){

}

EventoModel.prototype.findAllEntrega = function(callback){
    var tipoEntrega = TipoEventos.get("Entrega")._id;
    mongo.collection('Eventos').find({ DataFinalizacao : { "$exists" : false }, "TipoEvento._id": mongo.ObjectId(tipoEntrega) }).sort({ "Pedido.ItensPedidos.DataEntrega" : 1 }, callback);
}

EventoModel.prototype.findAllRetirada = function(callback){
    var tipoRetirada = TipoEventos.get("Retirada")._id;
    console.log(tipoRetirada)
    mongo.collection('Eventos').find({ DataFinalizacao : { "$exists" : false }, "TipoEvento._id": mongo.ObjectId(tipoRetirada) }).sort({ "Pedido.ItensPedidos.DataRetirada" : 1 }, callback);
}


EventoModel.prototype.endEvent = function(data, id, callback){
  delete data._id;
  data.DataFinalizacao = new Date();
  console.log(mongo.ObjectId(id).toString());
	mongo.collection('Eventos').update({ _id: mongo.ObjectId(id) }, { $set: data }, callback);
}
EventoModel.prototype.findOne = function(id, callback){
  console.log(mongo.ObjectId(id));
	mongo.collection('Eventos').findOne({ _id: mongo.ObjectId(id) }, callback);
}


EventoModel.prototype.create = function(data, callback){
  var evento = { Pedido: data.Pedido, TipoEvento: TipoEventos.get(data.TipoEvento), DataInclusao: new Date()}
  if(data.TipoEvento.toLowerCase() === "retirada"){
    evento.EventoPai = data.Evento;
  }
  mongo.collection('Eventos').save(evento, callback);
}

module.exports = new EventoModel();
