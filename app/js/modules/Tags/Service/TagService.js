angular.module('inspinia')
.service('tags', function ($http) {
  var service = this

    service.GetTagsByEventos = function (eventId) {
        return executeAPI($http, 'GET', URI_Node + 'Tags/Evento/' + eventId);
    };

    service.GetTagsByCliente = function (clienteId) {
        return executeAPI($http, 'GET', URI_Node + 'Tags/Cliente/' + clienteId);
    };

    service.Add = function (model) {
        return executeAPI($http, 'POST', URI_Node + 'Tags', model)
    };
})
