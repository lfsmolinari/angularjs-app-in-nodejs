angular.module('inspinia')
.service('centroDeCusto', function ($http) {
  var service = this

    service.GetCentroDeCustos = function () {
        return executeAPI($http, 'GET', URI_Node + 'Admin/CentroDeCusto')
    };

    service.AddCentroDeCusto = function (model) {
        return executeAPI($http, 'POST', URI_Node + 'Admin/CentroDeCusto', model)
    };

    service.DeleteCentroDeCusto = function (id) {
        return executeAPI($http, 'DELETE', URI_Node + 'Admin/CentroDeCusto/' + id, null)
    };

    service.GetTipoCentroDeCustos = function () {
        return executeAPI($http, 'GET', URI_Node + 'Admin/CentroDeCusto/Tipo')
    };

})
