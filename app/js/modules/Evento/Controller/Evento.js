angular.module('inspinia')
.controller('EventoController', ['$scope', '$http',  '$uibModal', 'SweetAlert', 'evento', function ($scope, $http,  $uibModal, SweetAlert, evento) {
    $scope.Evento = {};
    $scope.searchForm = "";
    $scope.retiradaSearch = "";
    $scope.Resultado = {};
    $scope.Resultado.Eventos = new Array();

    $scope.refreshResults = function(){
      $scope.GetEventosEntrega();
      $scope.GetEventosRetirada();
    }
    $scope.GetEventosEntrega = function(){
      evento.GetEventosEntrega().then(function (resultado) {
        //console.log(resultado.data);
          $scope.Eventos = resultado.data;
          var itensPedidos = Enumerable.From(resultado.data).Select(function(evento){
            //console.log(evento);
            return Enumerable.From(evento.Pedido.ItensPedidos).Select(function(item){
                return { idEvento: evento._id, nomeCliente: evento.Pedido.Cliente.Nome ,codigoPedido: evento.Pedido.CodigoPedido, EndEntrega: evento.Pedido.EndEntrega , itemPedido: item, tipoEvento: evento.TipoEvento.Descricao}
            }).ToArray();
          }).ToArray();
          var itens = [];
          for (var i = 0; i < itensPedidos.length; i++) {
            for (var j = 0; j < itensPedidos[i].length; j++) {
              itens.push(itensPedidos[i][j]);
            }
          }
          $scope.Resultado.Eventos = Enumerable.From(itens).OrderBy(function(i){ return i.itemPedido.DataEntrega}).ToArray();
          //console.log(itens)
      });
    }

    $scope.GetEventosRetirada = function(){
      evento.GetEventosRetirada().then(function (resultado) {
        //console.log(resultado.data);
          $scope.EventosRetirada = resultado.data;
          var itensPedidos = Enumerable.From(resultado.data).Select(function(evento){
            //console.log(evento);
            return Enumerable.From(evento.Pedido.ItensPedidos).Select(function(item){
                return { idEvento: evento._id, nomeCliente: evento.Pedido.Cliente.Nome ,codigoPedido: evento.Pedido.CodigoPedido, EndEntrega: evento.Pedido.EndEntrega , itemPedido: item, tipoEvento: evento.TipoEvento.Descricao}
            }).ToArray();
          }).ToArray();
          var itens = [];
          for (var i = 0; i < itensPedidos.length; i++) {
            for (var j = 0; j < itensPedidos[i].length; j++) {
              itens.push(itensPedidos[i][j]);
            }
          }
          $scope.Resultado.EventosRetirada = Enumerable.From(itens).OrderBy(function(i){ return i.itemPedido.DataEntrega}).ToArray();
          //console.log(itens)
      });
    }

    $scope.refreshResults();

    $scope.Inserir = function () {
         evento.AddEvento($scope.Evento).then(function (resultado) {
            //console.log(resultado);
            if (resultado.data.Success) {
                $scope.refreshResults();
            }
        });
    }
    $scope.FinalizarEventoRetirada = function(evento){
      var modalInstance = $uibModal.open({
            templateUrl: 'views/Dialogs/FinalizarEventoDialog.html',
            controller: 'EventoDialogController',
            resolve: {
              model: function () {
                return Enumerable.From($scope.EventosRetirada).Where(function(e){ return e._id === evento.idEvento}).FirstOrDefault();
              }
            }
        });
        modalInstance.result.then(function (result) {
            if(result.success){
              SweetAlert.swal({
                  title: "Sucesso!",
                  text: "Evento finalizado com sucesso!",
                  type: "success"
              });
            }
            else{
              SweetAlert.swal({
                  title: "Erro!",
                  text: "Não foi possível finalizar esse Evento!\n\b" + result.Mensagem,
                  type: "warning",
                  showCancelButton: false,
                  confirmButtonText: "Ok",
                  closeOnConfirm: true,
                  closeOnCancel: false
              });
            }

            $scope.refreshResults();
        });
      };
    $scope.FinalizarEvento = function(evento){
      var modalInstance = $uibModal.open({
            templateUrl: 'views/Dialogs/FinalizarEventoDialog.html',
            controller: 'EventoDialogController',
            resolve: {
              model: function () {
                return Enumerable.From($scope.Eventos).Where(function(e){ return e._id === evento.idEvento}).FirstOrDefault();
              }
            }
        });
        modalInstance.result.then(function (result) {
            if(result.success){
              SweetAlert.swal({
                  title: "Sucesso!",
                  text: "Evento finalizado com sucesso!",
                  type: "success"
              });
            }
            else{
              SweetAlert.swal({
                  title: "Erro!",
                  text: "Não foi possível finalizar esse Evento!\n\b" + result.Mensagem,
                  type: "warning",
                  showCancelButton: false,
                  confirmButtonText: "Ok",
                  closeOnConfirm: true,
                  closeOnCancel: false
              });
            }

            $scope.refreshResults();
        });
      };
      //PedidoDialogController
      $scope.VisualizarPedido = function(evento, isEntrega){
        var eventoSelecionado = {}
        if(isEntrega){
          eventoSelecionado = Enumerable.From($scope.Eventos).Where(function(e){ return e._id === evento.idEvento}).FirstOrDefault();
        }
        else {
          eventoSelecionado = Enumerable.From($scope.EventosRetirada).Where(function(e){ return e._id === evento.idEvento}).FirstOrDefault();
        }
        var modalInstance = $uibModal.open({
              templateUrl: 'views/Dialogs/VisualizarPedido.html',
              controller: 'PedidoDialogController',
              resolve: {
                model: function () {
                  return {IdPedido : eventoSelecionado.Pedido._id, ItensPedidos: eventoSelecionado.Pedido.ItensPedidos }
                }
              }
          });
        };
}]);
