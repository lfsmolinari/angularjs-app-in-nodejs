var express = require('express');
var router = express.Router();

var FuncionarioController = require('../Controller/FuncionarioController');

router.get ('/', FuncionarioController.findAll.bind(FuncionarioController));
router.get ('/Funcionario/:cpf/:nome', FuncionarioController.findByNomeCpf.bind(FuncionarioController));
router.get ('/Funcionario/:id', FuncionarioController.findOne.bind(FuncionarioController));
router.post('/', FuncionarioController.create.bind(FuncionarioController));
router.put('/Funcionario/:id', FuncionarioController.update.bind(FuncionarioController));

module.exports = router;
