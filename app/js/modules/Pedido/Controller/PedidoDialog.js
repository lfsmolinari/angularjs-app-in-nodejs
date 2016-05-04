angular.module('inspinia')
.controller('PedidoDialogController', function ($scope, $uibModalInstance, Pedido, model) {
  Pedido.GetPedido(model.IdPedido).then(function(result){
    debugger;
    $scope.hideStatus = model.hideStatus;
    $scope.Cliente = result.data.Cliente;
    $scope.Pedido = result.data;
    $scope.ItensPedidos = model.ItensPedidos
    $scope.Contato = {};
    $scope.showPF = ($scope.Cliente.TipoPessoa === 1);
    angular.forEach($scope.Cliente.Contatos, function (value, key) {
        if (value.ContatoPessoal.TipoContato === 1) {
            $scope.Contato.Email = value.ContatoPessoal.Descricao;
        }
        if (value.ContatoPessoal.TipoContato === 2) {
            $scope.Contato.Telefone = value.ContatoPessoal.Descricao;
        }
        if (value.ContatoPessoal.TipoContato === 3) {
            $scope.Contato.Celular = value.ContatoPessoal.Descricao;
        }
    });
  });


  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };

});
