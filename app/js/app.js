'use strict';

// Declare app level module which depends on filters, and services
//var myApp = angular.module('myApp', [
//    'ngAnimate',
//    'ngTouch',
//  'ngRoute',
//    'ui.bootstrap'
//  //'myApp.filters.filters',
//  //'myApp.services.gameLogicService',
//  //  'myApp.controllers.gameCtrl',
//  //  'myApp.controllers.gameAlertCtrl',
//  //'myApp.directives'
//]).
//config(['$routeProvider', function($routeProvider) {
//  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
//  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
//  $routeProvider.otherwise({redirectTo: '/view2'});
//}]);

angular.module('myApp',['ngTouch', 'ui.bootstrap'])
    .constant("CONSTANT", {
        GAME_BOARD_ROWS: 6,
        GAME_BOARD_COLS: 18,
        GAME_AREA_PADDING_PERCENTAGE: 0.02})
;
