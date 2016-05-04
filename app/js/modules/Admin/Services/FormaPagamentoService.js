angular.module('inspinia')
.service('formaPagamento', function ($http) {
  var service = this

    service.GetFormaPagamentos = function () {
        return executeAPI($http, 'GET', URI_Node + 'Admin/FormaPagamentos')
    };

    service.AddFormaPagamentos = function (model) {
        return executeAPI($http, 'POST', URI_Node + 'Admin/FormaPagamentos', model)
    };

    service.DeleteFormaPagamentos = function (id) {
        return executeAPI($http, 'DELETE', URI_Node + 'Admin/FormaPagamentos/' + id, null)
    };
})
