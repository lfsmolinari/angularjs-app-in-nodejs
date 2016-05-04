var express = require('express');
var router = express.Router();

var PedidoController = require('../Controller/PedidoController');

router.post ('/', PedidoController.create.bind(PedidoController));
router.get ('/', PedidoController.findAll.bind(PedidoController));
router.get ('/Pedido/:id', PedidoController.findOne.bind(PedidoController));
router.get ('/Codigo', PedidoController.GetCodigoPedido.bind(PedidoController));
router.put ('/Pedido/:id', PedidoController.update.bind(PedidoController));
router.delete ('/Pedido/:id', PedidoController.remove.bind(PedidoController));

module.exports = router;
