angular.module('inspinia')
.controller('CentroDeCustoCtrl', function ($scope, $http, SweetAlert, centroDeCusto) {
    $scope.CentroDeCusto = {};
    $scope.Resultado = {};
    $scope.Resultado.CentroDeCustos = new Array();
    $scope.Resultado.CentroDeCustosAssociado = new Array();
    $scope.CentroDeCusto.Descricao = "";
    $scope.CentroDeCusto.Codigo = "";
    $scope.CentroDeCusto.Tipo ={};

    $scope.refreshResults = function(){
        centroDeCusto.GetCentroDeCustos().then(function (resultado) {
            $scope.Resultado.CentroDeCustos = resultado.data;
        });
    }

    $scope.Inserir = function () {
      if($scope.CentroDeCusto.Tipo && $scope.CentroDeCusto.Codigo === ""){
        centroDeCusto.AddCentroDeCusto($scope.CentroDeCusto).then(function (resultado) {
            //console.log(resultado);
            if (resultado.data.Success) {
                $scope.CentroDeCusto.Descricao = "";
                $scope.CentroDeCusto.Codigo = "";
                $scope.CentroDeCusto.Tipo ={};
                $scope.CentroDeCusto.CentroDeCustoPai ={};
                $scope.refreshResults();
            }
        });
      }
      else{
        SweetAlert.swal({
            title: "Alerta!",
            text: "Centro de Custo e Tipo não podem ser vazios!",
            type: "warning",
            showCancelButton: false,
            confirmButtonText: "Ok",
            closeOnConfirm: true,
            closeOnCancel: false
        });
      }

    }

    $scope.Excluir = function (index) {
        if ($scope.Resultado.CentroDeCustos[index]._id) {
            centroDeCusto.DeleteCentroDeCusto($scope.Resultado.CentroDeCustos[index]._id).then(function (resultado) {
                if (resultado.data.Success) {
                    $scope.refreshResults();

                    SweetAlert.swal({
                        title: "Sucesso!",
                        text: "Centro de Custo foi deletado com sucesso!",
                        type: "success"
                    });
                } else {
                    SweetAlert.swal({
                        title: "Erro!",
                        text: "Não foi possível deletar o Centro de Custo!\n" + resultado.data.Mensagem,
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
                text: "Centro de Custo foi deletado com sucesso!",
                type: "success"
            });
        }
    }

    $scope.OnSelectTipoCentroCusto = function(){
      $scope.Resultado.CentroDeCustosAssociado = Enumerable.From($scope.Resultado.CentroDeCustos).Where(function(item){ return item.Tipo.Codigo === $scope.CentroDeCusto.Tipo.Codigo}).ToArray();
    }

    $scope.refreshResults();
    centroDeCusto.GetTipoCentroDeCustos().then(function (resultado) {
        $scope.Resultado.TipoCentroDeCustos = resultado.data;
    });
})
