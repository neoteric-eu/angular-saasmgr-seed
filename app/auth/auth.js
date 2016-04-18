'use strict';

angular.module('myApp.auth', ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            controller: 'LoginCtrl',
            templateUrl: 'auth/login.html'
        })
        .when('/register', {
            controller: 'RegistrationCtrl',
            templateUrl: 'auth/registration.html'
        });
}])

.controller('LoginCtrl', ['$scope', 'User', '$location', function ($scope, User, $location) {
    $scope.credentials = {};

    $scope.login = function () {
        $scope.error = false;
        User.login($scope.credentials).then(function () {
            $scope.credentials = {};
            $location.path('/view1');
        }, function () {
            $scope.error = true;
        });
    };
}])

.controller('RegistrationCtrl', ['$scope', 'User', '$location', function ($scope, User, $location) {
    $scope.user_info = {};

    $scope.register = function () {
        User.registration($scope.user_info).then(function () {
            $scope.user_info = {};
            $location.path('/view1');
        }, function (response) {
            $scope.error = response.data.message;
        });
    };
}]);