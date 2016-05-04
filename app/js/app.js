/**
 * INSPINIA - Responsive Admin Theme
 *
 */
 var URI = 'http://localhost:49435/Api/';
 var URI_Node = 'http://nodejs-lmolinari.rhcloud.com/';
 //var URI_Node = 'http://localhost:8080/';
(function () {
    angular.module('inspinia', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'pascalprecht.translate',       // Angular Translate
        'ngIdle',                       // Idle timer
        'ngCpfCnpj',                    // ng-cpf-cnpj
        'currencyMask',
        'angular-linq',
        'ngTagsInput'
    ])
})();

// Other libraries are loaded dynamically in the config.js file using the library ocLazyLoad
