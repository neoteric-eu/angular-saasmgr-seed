'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.auth',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).value('apiUrl', 'http://dev.sharedservices.ntrc.eu:4100/api/v2').config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]).controller('AppCtrl', ['$scope', '$location', 'User', function ($scope, $location, User) {
  $scope.appReady = false;

  User.getInfo().then(function () {
    $location.path('/view1');
  }).catch(function () {
    $location.path('/login');
  }).finally(function () {
    $scope.appReady = true;
  });

  $scope.isActive = function (location) {
    return location === $location.path();
  };

  $scope.logout = function () {
    User.logout().then(function () {
      $scope.user = null;
      $location.path('/login');
    });
  };

  $scope.$on(User.update_broadcast, function () {
    $scope.user = User.model;
  });

  $scope.$on('$routeChangeStart', function (event, next) {
    if (next.$$route !== undefined) {
      var nextRoute = next.$$route.originalPath;
      if (User.model.id === undefined && (nextRoute != '/register' && nextRoute != '/login')) {
        $location.path('/login');
      }
    }
  });
}]);
