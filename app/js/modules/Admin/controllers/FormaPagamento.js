angular.module('inspinia')
.controller('FormaPgtoController', function ($scope, $http, SweetAlert, formaPagamento) {
    $scope.FormaPagamento = {};
    $scope.Resultado = {};
    $scope.Resultado.FormaPagamentos = new Array();
    $scope.FormaPagamento.Descricao = "";

    $scope.refreshResults = function(){
        formaPagamento.GetFormaPagamentos().then(function (resultado) {
            $scope.Resultado.FormaPagamentos = resultado.data;
        });
    }
    $scope.refreshResults();

    $scope.Inserir = function () {
        formaPagamento.AddFormaPagamentos($scope.FormaPagamento).then(function (resultado) {
            //console.log(resultado);
            if (resultado.data.Success) {
                $scope.FormaPagamento.Descricao = "";
                $scope.refreshResults();
            }
        });
    }

    $scope.Excluir = function (index) {
        if ($scope.Resultado.FormaPagamentos[index]._id) {
            formaPagamento.DeleteFormaPagamentos($scope.Resultado.FormaPagamentos[index]._id).then(function (resultado) {
                if (resultado.data.Success) {
                    $scope.refreshResults();

                    SweetAlert.swal({
                        title: "Sucesso!",
                        text: "Forma de Pagamento deletado com sucesso!",
                        type: "success"
                    });
                } else {
                    SweetAlert.swal({
                        title: "Erro!",
                        text: "Não foi possível deletar o Forma de Pagamento!\n" + resultado.data.Mensagem,
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        closeOnConfirm: true,
                        closeOnCancel: false
                    });
                }
            });
        }
        else {
            $scope.Resultado.FormaPagamentos.splice(index, 1);
            SweetAlert.swal({
                title: "Sucesso!",
                text: "Forma de Pagamento foi deletado com sucesso!",
                type: "success"
            });
        }
    }
})
