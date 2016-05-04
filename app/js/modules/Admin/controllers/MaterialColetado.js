angular.module('inspinia')
.controller('MaterialColetadoCtrl', function ($scope, $http, SweetAlert, materialColetado) {
    $scope.MaterialColetado = {};
    $scope.Resultado = {};
    $scope.Resultado.MateriaisColetados = new Array();
    $scope.MaterialColetado.Descricao = "";

    $scope.refreshResults = function(){
        materialColetado.GetMateriaisColetados().then(function (resultado) {
            $scope.Resultado.MateriaisColetados = resultado.data;
        });
    }
    $scope.refreshResults();

    $scope.Inserir = function () {
        materialColetado.AddMaterialColetado($scope.MaterialColetado).then(function (resultado) {
            //console.log(resultado);
            if (resultado.data.Success) {
                $scope.MaterialColetado.Descricao = "";
                $scope.refreshResults();
            }
        });
    }

    $scope.Excluir = function (index) {
        if ($scope.Resultado.MateriaisColetados[index]._id) {
            materialColetado.DeleteMaterialColetado($scope.Resultado.MateriaisColetados[index]._id).then(function (resultado) {
                if (resultado.data.Success) {
                    $scope.refreshResults();

                    SweetAlert.swal({
                        title: "Sucesso!",
                        text: "Material Coletado foi deletado com sucesso!",
                        type: "success"
                    });
                } else {
                    SweetAlert.swal({
                        title: "Erro!",
                        text: "Não foi possível deletar o tipo de Material coletado!\n" + resultado.data.Mensagem,
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
            $scope.Resultado.MateriaisColetados.splice(index, 1);
            SweetAlert.swal({
                title: "Sucesso!",
                text: "Material Coletado foi deletado com sucesso!",
                type: "success"
            });
        }
    }
})
