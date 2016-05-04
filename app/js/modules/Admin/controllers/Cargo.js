angular.module('inspinia')
.controller('CargoController', function ($scope, $http, SweetAlert, cargo) {
    $scope.Cargo = {};
    $scope.Resultado = {};
    $scope.Resultado.Cargos = new Array();
    $scope.Cargo.Descricao = "";

    $scope.refreshResults = function(){
        cargo.GetCargos().then(function (resultado) {
            $scope.Resultado.Cargos = resultado.data;
        });
    }
    $scope.refreshResults();
    $scope.Inserir = function () {
         cargo.AddCargo($scope.Cargo).then(function (resultado) {
            //console.log(resultado);
            if (resultado.data.Success) {
                $scope.Cargo.Descricao = "";
                $scope.refreshResults();
            }
        });
    }

    $scope.Excluir = function (index) {
        if ($scope.Resultado.Cargos[index]._id) {
            cargo.DeleteCargo($scope.Resultado.Cargos[index]._id).then(function (resultado) {
                if (resultado.data.Success) {
                    $scope.refreshResults();

                    SweetAlert.swal({
                        title: "Sucesso!",
                        text: "Cargo deletado com sucesso!",
                        type: "success"
                    });
                } else {
                    SweetAlert.swal({
                        title: "Erro!",
                        text: "Não foi possível deletar o Cargo!\n" + resultado.data.Mensagem,
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
            $scope.Resultado.Cargos.splice(index, 1);
            SweetAlert.swal({
                title: "Sucesso!",
                text: "Cargo foi deletado com sucesso!",
                type: "success"
            });
        }
    }
})
