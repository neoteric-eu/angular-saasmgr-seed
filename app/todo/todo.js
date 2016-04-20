'use strict';

angular.module('myApp.todo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/todo', {
    templateUrl: 'todo/todo.html',
    controller: 'TodoCtrl'
  });
}])

.controller('TodoCtrl', ['$scope', function($scope) {
  $scope.todoList = getTodos();
  $scope.todoMax = getMaxTodo();

  $scope.addTodo = function () {
    $scope.todoList.push({name: $scope.todo});
    $scope.todo = '';
    persistTodos();
  };

  $scope.removeTodo = function (idx) {
    $scope.todoList.splice(idx, 1);
    persistTodos();
  };

  $scope.isMax = function() {
    return $scope.todoList.length === $scope.todoMax;
  };

  function getTodos() {
    var todos = [];
    try {
      todos = JSON.parse(localStorage.getItem('todos'));
    } catch (e) {}
    return todos || [];
  }

  function persistTodos() {
    localStorage.setItem('todos', JSON.stringify($scope.todoList));
  }

  function getMaxTodo() {
    var max = 0, n = $scope.$root.user.customers[0].constraints.length;
    for(var i = 0; i < n; ++i) {
      var constraint = $scope.$root.user.customers[0].constraints[i];
      if(constraint.key === 'TODO_MAX') {
        max = constraint.maxValue;
        break;
      }
    }
    return max;
  }
}]);