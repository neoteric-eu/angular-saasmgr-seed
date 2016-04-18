'use strict';

angular.module('myApp.packages', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/packages', {
    templateUrl: 'packages/packages.html',
    controller: 'PackagesCtrl'
  });
}])

.controller('PackagesCtrl', [function() {

}]);