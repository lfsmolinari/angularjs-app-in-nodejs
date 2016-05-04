var express = require('express');
var router = express.Router();

var CargoController = require('../Controller/CargoController');
var FormaPgtoController = require('../Controller/FormaPgtoController');
var MaterialController = require('../Controller/MaterialController');

router.get ('/Cargos', CargoController.findAll.bind(CargoController));
router.post ('/Cargos', CargoController.create.bind(CargoController));
router.delete ('/Cargos/:id', CargoController.remove.bind(CargoController));
router.get ('/FormaPagamentos', FormaPgtoController.findAll.bind(FormaPgtoController));
router.post ('/FormaPagamentos', FormaPgtoController.create.bind(FormaPgtoController));
router.delete ('/FormaPagamentos/:id', FormaPgtoController.remove.bind(FormaPgtoController));
router.get ('/MateriaisColetados', MaterialController.findAll.bind(MaterialController));
router.post ('/MateriaisColetados', MaterialController.create.bind(MaterialController));
router.delete ('/MateriaisColetados/:id', MaterialController.remove.bind(MaterialController));

module.exports = router;
