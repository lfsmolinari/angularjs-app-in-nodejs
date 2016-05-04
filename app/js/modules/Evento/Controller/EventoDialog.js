angular.module('inspinia')
.controller('EventoDialogController', function ($scope, $uibModalInstance, evento, tags, model) {
  $scope.descricao = "";
  $scope.finalizar = function () {
      evento.FianlizaEvento(model._id, model).then(function(result) {
        angular.forEach($scope.tagsArray, function (value, key) {
            tags.Add({ Evento: model,
                       Cliente:model.Pedido.Cliente,
                       Tag: value.text,
                       DataInclusao: new Date()});
        });
      if(result.data.Success && model.TipoEvento.Descricao.toLowerCase() === "entrega"){
        model.DataFinalizacao = new Date();
        evento.AddEvento({Pedido: model.Pedido, TipoEvento: "Retirada", Evento:  model  }).then(function (result){
              $uibModalInstance.close({ success: result.data.Success, mensagem: result.data.Mensagem});
        });
      }
      else{
          $uibModalInstance.close({ success: result.data.Success, mensagem: result.data.Mensagem});
      }
    });
  };

  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };

});
