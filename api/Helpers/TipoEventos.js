var Enum = require('enum');
var mongo = require('../DB/mongo');
var tipoEventos = new Enum({'Entrega': '56d3357159304e96bf000002', 'Retirada': '56d336ed59304e96bf000003'});

function TipoEventos(){
  this.get = function(tipo){
    return { _id: mongo.ObjectId(tipoEventos.get(tipo).value), Descricao:  tipoEventos.get(tipo).key};
  }
}
module.exports = new TipoEventos();
