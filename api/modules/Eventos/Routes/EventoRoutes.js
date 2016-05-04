var express = require('express');
var router = express.Router();

var EventoController = require('../Controller/EventoController');

router.post ('/', EventoController.create.bind(EventoController));
router.get ('/Entrega', EventoController.findAllEntrega.bind(EventoController));
router.get ('/Retirada', EventoController.findAllRetirada.bind(EventoController));
router.get ('/:id', EventoController.findOne.bind(EventoController));
//router.get ('/Evento/:id', EventoController.findOne.bind(EventoController));
router.put ('/Evento/:id', EventoController.endEvent.bind(EventoController));
//router.delete ('/Pedido/:id', EventoController.remove.bind(EventoController));

module.exports = router;
