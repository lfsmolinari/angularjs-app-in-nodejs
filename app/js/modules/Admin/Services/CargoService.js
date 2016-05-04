angular.module('inspinia')
.service('cargo', function ($http) {
  var service = this

    service.GetCargos = function () {
        return executeAPI($http, 'GET', URI_Node + 'Admin/Cargos')
    };

    service.AddCargo = function (model) {
        return executeAPI($http, 'POST', URI_Node + 'Admin/Cargos', model)
    };

    service.DeleteCargo = function (id) {
        return executeAPI($http, 'DELETE', URI_Node + 'Admin/Cargos/' + id, null)
    };
})
