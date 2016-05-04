var express = require('express');
var router = express.Router();

var PessoaController = require('../Controller/PessoaController');

//router.delete('/products/:_id', ProductsController.delete.bind(ProductsController));


router.get ('/', PessoaController.findAll.bind(PessoaController));
router.get ('/Pessoa/:id', PessoaController.findOne.bind(PessoaController));
router.get ('/Pessoa/:cpf/:cnpj', PessoaController.findByCpfCnpj.bind(PessoaController));
router.get ('/Clientes', PessoaController.findAllCustomer.bind(PessoaController));
router.get ('/Cliente/:cpf/:cnpj/:nome', PessoaController.findCustomerByNomeCpfCnpj.bind(PessoaController));
router.get ('/Fornecedores', PessoaController.findAllSupplier.bind(PessoaController));
router.get ('/Fornecedor/:cpf/:cnpj/:nome', PessoaController.findSupplierByNomeCpfCnpj.bind(PessoaController));
router.post('/', PessoaController.create.bind(PessoaController));
router.put('/Pessoa/:id', PessoaController.update.bind(PessoaController));

module.exports = router;
