angular.module('inspinia')
.service('evento', function ($http) {
  var service = this

    service.GetCategorias = function () {
        return executeAPI($http, 'GET', URI_Node + 'Eventos/Entrega')
    };

    service.GetAtivos = function () {
        return executeAPI($http, 'GET', URI_Node + 'Eventos/Retirada')
    };

    service.AddAtivo = function (model) {
        return executeAPI($http, 'POST', URI_Node + 'Eventos', model)
    };

    service.FianlizaEvento = function (id, model) {
        return executeAPI($http, 'PUT', URI_Node + 'Eventos/Evento/' + id, model)
    };
})
