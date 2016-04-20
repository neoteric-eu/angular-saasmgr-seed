'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.auth',
  'myApp.todo',
  'myApp.packages',
  'myApp.version'
]).value('apiUrl', 'http://dev.sharedservices.ntrc.eu:4100/api/v2').config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/todo'});
}]).run(['$rootScope', '$location', 'User', function ($rootScope, $location, User) {
  $rootScope.appReady = false;

  User.getInfo().then(function () {
    $location.path('/todo');
  }).catch(function () {
    $location.path('/login');
  }).finally(function () {
    $rootScope.appReady = true;
  });
}]).controller('AppCtrl', ['$scope', '$location', 'User', function ($scope, $location, User) {
  $scope.isActive = function (location) {
    return location === $location.path();
  };

  $scope.logout = function () {
    User.logout().then(function () {
      $scope.$root.user = null;
      $location.path('/login');
    });
  };

  $scope.$on(User.update_broadcast, function () {
    $scope.$root.user = User.model;
  });

  $scope.$on('$routeChangeStart', function (event, next) {
    if (next.$$route !== undefined) {
      var nextRoute = next.$$route.originalPath;
      if (User.model.id === undefined && (nextRoute !== '/register' && nextRoute !== '/login')) {
        $location.path('/login');
      }
    }
  });
}]);
