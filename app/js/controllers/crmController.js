/// <reference path="../angular.js" />

function executeAPI($http, metodo, url, item) {
    return $http({
        method: metodo,
        url: url,
        data: item,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
    });
};
function procuraCEP(cep) {
    var endereco = null;
    $.ajax({
        type: 'POST',
        url: 'http://homologa.assigntecnologias.com.br/crm/pagina/php/cep.php',
        data: { cep: cep },
        success: function (retorno) {
            //console.log("$.post");
            //console.log(retorno);
            endereco = {};
            endereco.Logradouro = retorno.logradouro;
            endereco.Bairro = retorno.bairro;
            endereco.Cidade = retorno.cidade;
            endereco.UF = retorno.uf;
        },
        dataType: 'json',
        async: false
    });

    return endereco
}
function executeRhAPI($http, ENDPOINT_URI) {
    var service = this,
    pathAdd = 'Funcionarios',
    pathUpd = 'Funcionarios/Funcionario/';

    function getUrl() {
        return ENDPOINT_URI + path;
    }

    function getUrlForId(itemId) {
        return getUrl(path) + itemId;
    }

    service.Salvar = function (item, isUpdate) {
        if(isUpdate)
            return executeAPI($http, 'PUT', URI_Node + pathUpd + item._id, item);
        else
            return executeAPI($http, 'POST', URI_Node + pathAdd, item);
    };
}
function metodosClientes($http, ENDPOINT_URI) {
    var service = this,
    pathAdd = 'Pessoas',
    pathUpd = 'Pessoas/Pessoa/';

    service.Salvar = function (item, isUpdate) {
        if(isUpdate)
            return executeAPI($http, 'PUT', URI_Node + pathUpd + item._id, item);
        else
            return executeAPI($http, 'POST', URI_Node + pathAdd, item);
    };
}
function ProcessaContatos(contato, contatos) {
    if (contato !== null) {
        var index = FindByProperty(contatos, "ContatoPessoal.TipoContato", 1, undefined);
        if (index > -1) {
            contatos[index].ContatoPessoal.Descricao = contato.Email;
        }
        else if (contato.Email !== undefined && contato.Email !== '') {
            var contatoPessoal = {
                ContatoPessoal: {
                    Descricao: contato.Email,
                    TipoContato: 1,
                }
            };
            contatos.push(contatoPessoal);
        }

        index = FindByProperty(contatos, "ContatoPessoal.TipoContato", 2, undefined);
        if (index > -1) {
            contatos[index].ContatoPessoal.Descricao = contato.Telefone;
        }
        else if (contato.Telefone !== undefined && contato.Telefone !== '') {
            var contatoPessoal = {
                ContatoPessoal: {
                    Descricao: contato.Telefone,
                    TipoContato: 2,
                }
            };
            contatos.push(contatoPessoal);
        }

        index = FindByProperty(contatos, "ContatoPessoal.TipoContato", 3, undefined);
        if (index > -1) {
            contatos[index].ContatoPessoal.Descricao = contato.Celular;
        }
        else if (contato.Celular !== undefined && contato.Celular !== '') {
            var contatoPessoal = {
                ContatoPessoal: {
                    Descricao: contato.Celular,
                    TipoContato: 3,
                }
            };
            contatos.push(contatoPessoal);
        }
    }
}
function novoEndereco(endereco, enderecos, isPrincipal) {
    if (endereco !== null) {
        enderecos.push({
            FuncionariosEndereco:{ IsPrincipal: isPrincipal },
            Endereco: {
                CEP: endereco.CEP.replace("-", ""),
                Complemento: endereco.Complemento,
                Numero: endereco.Numero
            }
        });
    }
}
function arrayObjectIndexOf(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], obj)) {
            return i;
        }
    };
    return -1;
}
function FindByProperty(arr, propertyName, value, obj) {
    var propertiesName = propertyName.split(".");
    for (var i = 0; i < arr.length; i++) {
        if (!angular.equals(arr[i], obj)) {
            if (propertiesName.length > 1) {
                if (arr[i][propertiesName[0]][propertiesName[1]] === value)
                    return i;
            }
            else {
                if (arr[i][propertiesName[0]] === value)
                    return i;
            }
        }
    };
    return -1;
}

function RhController($scope, $http, $stateParams, $q, $window, Funcionario, SweetAlert, cargo) {
    //console.log($stateParams);

    $scope.Funcionario = {};
    $scope.Endereco = {};
    $scope.Contato = {};
    cargo.GetCargos().then(function(resultado){
        $scope.Cargos = resultado.data;
    })
    //$scope.Funcionario.idFuncionario = $routeParams.idFuncionario;
    if ($stateParams.idFuncionario !== undefined) {
        $scope.Insert = false;
        executeAPI($http, 'GET', URI_Node + 'Funcionarios/Funcionario/' + $stateParams.idFuncionario, null).then(function (func) {
            console.log(func.data);
            $scope.Funcionario = func.data;
            var endereco = {};
            var contato = {};

            angular.forEach(func.data.Enderecos, function (value, key) {
                if (value.FuncionariosEndereco.IsPrincipal) {
                    endereco = value.Endereco;
                    var end = procuraCEP(endereco.CEP);
                    if (end !== null) {
                        endereco.Logradouro = end.Logradouro;
                        endereco.Bairro = end.Bairro;
                        endereco.Cidade = end.Cidade;
                        endereco.UF = end.UF;
                    }
                }
            });
            //console.log(func.data.Contatos);
            angular.forEach(func.data.Contatos, function (value, key) {
                if (value.ContatoPessoal.TipoContato === 1) {
                    contato.Email = value.ContatoPessoal.Descricao;
                }
                if (value.ContatoPessoal.TipoContato === 2) {
                    contato.Telefone = value.ContatoPessoal.Descricao;
                }
                if (value.ContatoPessoal.TipoContato === 3) {
                    contato.Celular = value.ContatoPessoal.Descricao;
                }
            });

            $scope.Contato = contato;
            $scope.Endereco = endereco;
            $scope.Funcionario.Ativo = $scope.Funcionario.StatusFuncionario == 1 ? true : false;
        });
    }
    else {

        $scope.Funcionario.Ativo = $scope.Funcionario.StatusFuncionario == 1 ? true : false;
        $scope.Funcionario.Nome = '';
    }

    $scope.FindCEP = function (cep) {
        var endereco = procuraCEP($('#txtCep').val());
        //var endereco = procuraCEP(cep);
        //console.log();
        console.log(cep);
        //console.log($scope.Endereco);
        if (endereco !== null) {
            $scope.Endereco.Logradouro = endereco.Logradouro;
            $scope.Endereco.Bairro = endereco.Bairro;
            $scope.Endereco.Cidade = endereco.Cidade;
            $scope.Endereco.UF = endereco.UF;
        }

    };

    $scope.Salvar = function (funcionario, contato, endereco) {
        //console.log(contato);
        //console.log(endereco);

        var contatos = new Array();
        var enderecos = new Array();

        if (funcionario.Enderecos !== undefined && funcionario.Enderecos.length > 0) {
            angular.forEach(funcionario.Enderecos, function (value, key) {
                if (value.IsPrincipal) {
                    value.Endereco.CEP = endereco.CEP.replace("-", "");
                    value.Endereco.Numero = endereco.Numero;
                    value.Endereco.Complemento = endereco.Complemento;
                }
            });
        }
        else {
            novoEndereco(endereco, enderecos, true);
            funcionario.Enderecos = enderecos
        }

        if (funcionario.Contatos == undefined) {
            funcionario.Contatos = new Array();
        }

        ProcessaContatos(contato, funcionario.Contatos)

        funcionario.StatusFuncionario = funcionario.Ativo ? 1 : 2;
        Funcionario.Salvar(funcionario, $stateParams.idFuncionario !== undefined).then(function (result) {
            debugger;
            console.log(result);
            if (result.data.Success)
                SweetAlert.swal({
                    title: "Sucesso!",
                    text: "Funcionário salvo com sucesso!",
                    type: "success"
                },
                function (isConfirm) {
                    if (isConfirm) {
                        $window.location.reload();
                    }
                });
            else
                SweetAlert.swal({
                    title: "Erro!",
                    text: "Não foi possível salvar!\n\b" + result.data.Mensagem,
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    closeOnConfirm: true,
                    closeOnCancel: false
                });
        });
    }

    $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.datepickerOptions = {
        format: 'yyyy-mm-dd',
        language: 'fr',
        autoclose: true,
        weekStart: 0
    }
    //console.log($scope);
}

function ConsultarRhController($scope, $http, Funcionario) {
    $scope.Funcionario = {};
    $scope.Resultado = {};
    $scope.Resultado.Show = false;
    $scope.Resultado.Funcionarios = new Array();
    $scope.Funcionario.CPF = "";
    $scope.Funcionario.Nome = "";

    executeAPI($http, 'GET', URI_Node + 'Funcionarios', null).then(function (resultado) {
        console.log(resultado);
        $scope.Resultado.Show = true;
        $scope.Resultado.Funcionarios = resultado.data;
    });

    $scope.Pesquisar = function (funcionario) {
        var cpf = 0, nome = 0;
        if (funcionario.CPF !== "")
            cpf = funcionario.CPF;
        if(funcionario.Nome !== "")
            nome = funcionario.Nome;

        executeAPI($http, 'GET', URI_Node + 'Funcionarios/Funcionario/' + cpf + '/' + nome, null).then(function (resultado) {
            //console.log(resultado);
            $scope.Resultado.Show = true;
            $scope.Resultado.Funcionarios = resultado.data;
        });
    }
}

function ConsultarClienteController($scope, $http, Cliente) {
    $scope.Cliente = {};
    $scope.Resultado = {};
    $scope.Resultado.Show = false;
    $scope.Resultado.Clientes = new Array();
    $scope.Cliente.CPF = "";
    $scope.Cliente.CNPJ = "";
    $scope.Cliente.Nome = "";

    executeAPI($http, 'GET', URI_Node + 'Pessoas/Clientes', null).then(function (resultado) {
        console.log(resultado);
        $scope.Resultado.Show = true;
        $scope.Resultado.Clientes = resultado.data;
    });

    $scope.Pesquisar = function (cliente) {
        var cpf = 0;
        var cnpj = 0;
        var nome = 0;

        if (cliente.CPF !== "")
            cpf = cliente.CPF;

        if (cliente.CNPJ !== "")
            cnpj = cliente.CNPJ;

        if (cliente.Nome !== "" && cliente.Nome !== undefined && cliente.Nome !== null)
            nome = cliente.Nome;

        executeAPI($http, 'GET', URI_Node + 'Pessoas/Cliente/' + cpf + '/' + cnpj + '/' + nome, null).then(function (resultado) {
            //console.log(resultado);
            $scope.Resultado.Show = true;
            $scope.Resultado.Clientes = resultado.data;
        });
        //executeAPI($http, 'GET', URI + 'Cadastro/GetClienteByNomeCpfCnpj?cpf=' + cpf + '&cnpj=' + cnpj + '&nome=' + cliente.Nome, null).then(function (resultado) {
        //    //console.log(resultado);
        //    $scope.Resultado.Show = true;
        //    $scope.Resultado.Clientes = resultado.data;
        //});
    }
}

function ClienteController($scope, $http, $stateParams, $q, $window, Cliente, SweetAlert) {
    $scope.Pessoa = {
        Enderecos: [],
        Contatos: new Array(),
        TipoPessoa: 1
    };
    $scope.Bloquear = false;
    $scope.Endereco = {};
    $scope.Contato = {};
    $scope.salvarNovoEnd = false;
    $scope.isEdit = false;
    $scope.selectedEnd = {};
    $scope.format = 'dd-MM-yyyy';
    $scope.showPF = ($scope.Pessoa.TipoPessoa === 1);
    if ($stateParams.IdPessoa !== undefined) {
        $scope.Insert = false;
        executeAPI($http, 'GET', URI_Node + 'Pessoas/Pessoa/' + $stateParams.IdPessoa, null).then(function (resultado) {
            console.log("Node.JS", resultado.data);
            $scope.Pessoa = resultado.data;
            //$scope.Bloquear = $scope.Pessoa.StatusPessoa == 1 ? false : true;
            var endereco = {};
            var contato = {};

            //console.log(pessoa.data.ContatoPessoal);
            angular.forEach($scope.Pessoa.Contatos, function (value, key) {
                if (value.ContatoPessoal.TipoContato === 1) {
                    contato.Email = value.ContatoPessoal.Descricao;
                }
                if (value.ContatoPessoal.TipoContato === 2) {
                    contato.Telefone = value.ContatoPessoal.Descricao;
                }
                if (value.ContatoPessoal.TipoContato === 3) {
                    contato.Celular = value.ContatoPessoal.Descricao;
                }
            });
            var index = 0;//FindByProperty($scope.Pessoa.Enderecos, "PessoasEndereco.IsPrincipal", true, $scope.Pessoa.Enderecos[0]);
            $scope.selectedEnd = $scope.Pessoa.Enderecos[index];
            $scope.Endereco = $scope.Pessoa.Enderecos[index];

            var endereco = procuraCEP($scope.Endereco.Endereco.CEP);
            if (endereco !== null) {
                $scope.Endereco.Endereco.Logradouro = endereco.Logradouro;
                $scope.Endereco.Endereco.Bairro = endereco.Bairro;
                $scope.Endereco.Endereco.Cidade = endereco.Cidade;
                $scope.Endereco.Endereco.UF = endereco.UF;
            }

            $scope.Contato = contato;
            $scope.Pessoa.Bloquear = $scope.Pessoa.StatusPessoa == 1 ? false : true;
            $scope.showPF = ($scope.Pessoa.TipoPessoa === 1);
        });
    }

    $scope.FindCEP = function () {
        var endereco = procuraCEP($('#txtCep').val());

        if (endereco !== null) {
            $scope.Endereco.Endereco.Logradouro = endereco.Logradouro;
            $scope.Endereco.Endereco.Bairro = endereco.Bairro;
            $scope.Endereco.Endereco.Cidade = endereco.Cidade;
            $scope.Endereco.Endereco.UF = endereco.UF;
        }

    };

    $scope.EditarEnd = function () {
        $scope.isEdit = true;
    }

    $scope.AddNovoEndereco = function () {
        $scope.salvarNovoEnd = true;
        $scope.isEdit = true;
        $scope.Endereco = { Endereco: {}, PessoasEndereco: {} };
    }

    $scope.SalvarNovoEndereco = function () {
        if ($scope.Endereco.Endereco.CEP !== undefined && $scope.Endereco.Endereco.Numero !== undefined) {
            var isPrincipal = $scope.Endereco.PessoasEndereco.IsPrincipal === undefined ? false : $scope.Endereco.PessoasEndereco.IsPrincipal;
            if (isPrincipal) {
                var index = FindByProperty($scope.Pessoa.Enderecos, "PessoasEndereco.IsPrincipal", true, $scope.Endereco);
                if (index > -1)
                    $scope.Pessoa.Enderecos[index].PessoasEndereco.IsPrincipal = false;
            }
            //novoEndereco($scope.Endereco.Endereco, $scope.Pessoa.Enderecos, isPrincipal);
            $scope.Endereco.Endereco.CEP = $scope.Endereco.Endereco.CEP.replace('-', '');
            $scope.Pessoa.Enderecos.push($scope.Endereco);
            $scope.selectedEnd = $scope.Endereco;//$scope.Pessoa.Enderecos[$scope.Pessoa.Enderecos.length - 1];
            $scope.salvarNovoEnd = false;
            $scope.isEdit = false;
        }
        else {
            SweetAlert.swal({
                title: "Atenção!",
                text: "É necessário que preencha os campos de número e CEP, Obrigado!",
                type: "warning",
                showCancelButton: false,
                //confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ok",
                closeOnConfirm: true,
                closeOnCancel: false
            },
           function (isConfirm) {
               $scope.Endereco.IsPrincipal = true;
           });
        }
    }

    $scope.CancelarNovoEndereco = function () {
        $scope.salvarNovoEnd = false;
        $scope.isEdit = false;
        $scope.Endereco = $scope.selectedEnd;
    }

    $scope.ChangeEndereco = function () {
        $scope.Endereco = $scope.selectedEnd;
        var endereco = procuraCEP($scope.Endereco.Endereco.CEP);
        if (endereco !== null) {
            $scope.Endereco.Endereco.Logradouro = endereco.Logradouro;
            $scope.Endereco.Endereco.Bairro = endereco.Bairro;
            $scope.Endereco.Endereco.Cidade = endereco.Cidade;
            $scope.Endereco.Endereco.UF = endereco.UF;
        }
        $scope.isEdit = false;
    }

    $scope.ChangePrincipalEnd = function () {
        var isPrincipal = $scope.Endereco.PessoasEndereco.IsPrincipal === undefined ? false : $scope.Endereco.PessoasEndereco.IsPrincipal;
        if ($scope.Pessoa.Enderecos.length > 0) {
            var index = FindByProperty($scope.Pessoa.Enderecos, "PessoasEndereco.IsPrincipal", true, $scope.Endereco);
            if (index > -1) {
                if (isPrincipal) {
                    if (arrayObjectIndexOf($scope.Pessoa.Enderecos, $scope.Endereco) > -1)
                        $scope.Pessoa.Enderecos[index].PessoasEndereco.IsPrincipal = false;
                }
            }
            else {
                SweetAlert.swal({
                    title: "Não foi possível alterar!",
                    text: "É necessário que pelo menos um endereço seja principal!",
                    type: "warning",
                    showCancelButton: false,
                    //confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    $scope.Endereco.IsPrincipal = true;
                });
            }
        }
    }

    $scope.ChangePersonType = function () {
        $scope.showPF = ($scope.Pessoa.TipoPessoa === 1);
    }

    $scope.AddContatoJuridico = function () {
        if ($scope.Pessoa.ContatoJuridico === undefined)
            $scope.Pessoa.ContatoJuridico = new Array();
        if ($scope.ContatoJuridico !== undefined) {
            if (($scope.ContatoJuridico.Nome !== '' && $scope.ContatoJuridico.Nome !== undefined) && ($scope.ContatoJuridico.Departamento !== '' && $scope.ContatoJuridico.Departamento !== undefined) &&
                (($scope.ContatoJuridico.Email !== '' && $scope.ContatoJuridico.Email !== undefined) ||
                 ($scope.ContatoJuridico.Celular !== '' && $scope.ContatoJuridico.Celular !== undefined) ||
                 ($scope.ContatoJuridico.RamalRadio !== '' && $scope.ContatoJuridico.RamalRadio !== undefined))) {

                $scope.Pessoa.ContatoJuridico.push($scope.ContatoJuridico);
                $scope.ContatoJuridico = {};
            }

        }
    }

    $scope.SalvarContatoJuridico = function () {
        if ($scope.ContatoJuridico !== undefined) {
            if (($scope.ContatoJuridico.Nome !== '' && $scope.ContatoJuridico.Nome !== undefined) &&
                ($scope.ContatoJuridico.Departamento !== '' && $scope.ContatoJuridico.Departamento !== undefined) &&
                (($scope.ContatoJuridico.Email !== '' && $scope.ContatoJuridico.Email !== undefined) ||
                 ($scope.ContatoJuridico.Celular !== '' && $scope.ContatoJuridico.Celular !== undefined) ||
                 ($scope.ContatoJuridico.RamalRadio !== '' && $scope.ContatoJuridico.RamalRadio !== undefined))) {

                var index = FindByProperty($scope.Pessoa.ContatoJuridico, "IdContatoJuridico", $scope.ContatoJuridico.IdContatoJuridico, $scope.ContatoJuridico);
                if (index > -1) {
                    $scope.Pessoa.ContatoJuridico[index].IdPessoa = $scope.ContatoJuridico.IdPessoa;
                    $scope.Pessoa.ContatoJuridico[index].IdContatoJuridico = $scope.ContatoJuridico.IdContatoJuridico;
                    $scope.Pessoa.ContatoJuridico[index].Nome = $scope.ContatoJuridico.Nome;
                    $scope.Pessoa.ContatoJuridico[index].RamalRadio = $scope.ContatoJuridico.RamalRadio;
                    $scope.Pessoa.ContatoJuridico[index].Celular = $scope.ContatoJuridico.Celular;
                    $scope.Pessoa.ContatoJuridico[index].Departamento = $scope.ContatoJuridico.Departamento;
                    $scope.Pessoa.ContatoJuridico[index].Email = $scope.ContatoJuridico.Email;
                }
                //$scope.Pessoa.ContatoJuridico.push($scope.ContatoJuridico);
                $scope.ContatoJuridico = {};
                $scope.salvarContato = false;
            }

        }
    }

    $scope.EditarContatoJuridico = function (index) {
        if ($scope.ContatoJuridico == undefined) {
            $scope.ContatoJuridico = {};
        }
        $scope.ContatoJuridico.IdPessoa = $scope.Pessoa.ContatoJuridico[index].IdPessoa;
        $scope.ContatoJuridico.IdContatoJuridico = $scope.Pessoa.ContatoJuridico[index].IdContatoJuridico;
        $scope.ContatoJuridico.Nome = $scope.Pessoa.ContatoJuridico[index].Nome;
        $scope.ContatoJuridico.RamalRadio = $scope.Pessoa.ContatoJuridico[index].RamalRadio;
        $scope.ContatoJuridico.Celular = $scope.Pessoa.ContatoJuridico[index].Celular;
        $scope.ContatoJuridico.Departamento = $scope.Pessoa.ContatoJuridico[index].Departamento;
        $scope.ContatoJuridico.Email = $scope.Pessoa.ContatoJuridico[index].Email;
        $scope.salvarContato = true;
    }

    $scope.RemoverContatoJuridico = function (index) {
        $scope.Pessoa.ContatoJuridico.splice(index, 1);
        // SweetAlert.swal({
        //     title: "Sucesso!",
        //     text: "Contato foi deletado com sucesso!",
        //     type: "success"
        // });
    }

    $scope.CancelarContatoJuridico = function () {
        $scope.ContatoJuridico = {};
        $scope.salvarContato = false;
    }

    $scope.VerificarCpfCnpj = function () {
        var cpf = 0;
        var cnpj = 0;
        var message = "";

        if ($scope.Pessoa.TipoPessoa === 1) {
            cpf = $("#Cpf").val();
            message = "Já existe uma Pessoa com esse  CPF.\n\b Deseja carregar suas informações?";
        }
        else {
            cnpj = $("#Cnpj").val();
            message = "Já existe uma Pessoa com esse  CNPJ.\n\b Deseja carregar suas informações?";
        }
        if ($stateParams.IdPessoa === undefined && cpf !== '' && cnpj !== '') {
            executeAPI($http, 'GET', URI_Node + 'Pessoas/Pessoa/' + cpf + '/' + cnpj, null).then(function (resultado) {
                console.log(resultado);
                if (resultado.data !== null) {
                    SweetAlert.swal({
                        title: "Atenção!",
                        text: message,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        cancelButtonText: "Não",
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            $window.location.href = "/#/cadastro/cliente/" + resultado.data._id;
                        }
                        else {
                            if ($scope.Pessoa.TipoPessoa === 1)
                                $scope.Pessoa.CPF = '';
                            else
                                $scope.Pessoa.CNPJ = '';
                        }
                    });
                }
            });
        }
    }

    $scope.Salvar = function () {
        if ($scope.Pessoa.Contatos === undefined) {
            $scope.Pessoa.Contatos = [];
        }
        ProcessaContatos($scope.Contato, $scope.Pessoa.Contatos);

        $scope.Pessoa.StatusPessoa = $scope.Bloquear ? 2 : 1;
        console.log($scope.Pessoa);
        angular.forEach($scope.Pessoa.Enderecos, function (value, key) {
            value.Endereco.CEP = value.Endereco.CEP.replace('-', '');
        });

        Cliente.Salvar($scope.Pessoa, $stateParams.IdPessoa !== undefined ).then(function (result) {
                console.log(result);
                //$scope.salved = result;
                if (result.data.Success)
                    SweetAlert.swal({
                        title: "Sucesso!",
                        text: "Cliente salvo com sucesso!",
                        type: "success"
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            $window.location.reload();
                        }
                    });
                else
                    SweetAlert.swal({
                        title: "Erro!",
                        text: "Não foi possível salvar o cliente!\n" + result.data.Mensagem,
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        closeOnConfirm: true,
                        closeOnCancel: false
                    });
            });

    }
}

function ConsultarFornecedorController($scope, $http, Cliente) {
    $scope.Cliente = {};
    $scope.Resultado = {};
    $scope.Resultado.Show = false;
    $scope.Resultado.Clientes = new Array();
    $scope.Cliente.CPF = "";
    $scope.Cliente.CNPJ = "";
    $scope.Cliente.Nome = "";

    executeAPI($http, 'GET', URI_Node + 'Pessoas/Fornecedores', null).then(function (resultado) {
        console.log(resultado);
        $scope.Resultado.Show = true;
        $scope.Resultado.Clientes = resultado.data;
    });

    $scope.Pesquisar = function (cliente) {
        var cpf = 0;
        var cnpj = 0;
        var nome = 0;

        if (cliente.CPF !== "")
            cpf = cliente.CPF;

        if (cliente.CNPJ !== "")
            cnpj = cliente.CNPJ;

        if (cliente.Nome !== "" && cliente.Nome !== undefined && cliente.Nome !== null)
            nome = cliente.Nome;

        executeAPI($http, 'GET', URI_Node + 'Pessoas/Fornecedor/' + cpf + '/' + cnpj + '/' + nome, null).then(function (resultado) {
            //console.log(resultado);
            $scope.Resultado.Show = true;
            $scope.Resultado.Clientes = resultado.data;
        });
    }
}

angular.module('inspinia')

.controller('RhController', RhController)
.controller('ConsultarRhController', ConsultarRhController)
.controller('ClienteController', ClienteController)
.controller('ConsultarClienteController', ConsultarClienteController)
.controller('ConsultarFornecedorController', ConsultarFornecedorController)
.constant('ENDPOINT_URI', URI)
.service('Funcionario', executeRhAPI)
.service('Cliente', metodosClientes);
