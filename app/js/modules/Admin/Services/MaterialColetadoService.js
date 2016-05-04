angular.module('inspinia')
.service('materialColetado', function ($http) {
  var service = this

    service.GetMateriaisColetados = function () {
        return executeAPI($http, 'GET', URI_Node + 'Admin/MateriaisColetados')
    };

    service.AddMaterialColetado = function (model) {
        return executeAPI($http, 'POST', URI_Node + 'Admin/MateriaisColetados', model)
    };

    service.DeleteMaterialColetado = function (id) {
        return executeAPI($http, 'DELETE', URI_Node + 'Admin/MateriaisColetados/' + id, null)
    };
})
