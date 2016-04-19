'use strict';

angular.module('myApp.packages', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/packages', {
    templateUrl: 'packages/packages.html',
    controller: 'PackagesCtrl'
  }).when('/packages/:id', {
    templateUrl: 'packages/bundle.html',
    controller: 'PackageCtrl'
  });
}])
.controller('PackageCtrl', ['$routeParams', '$location', '$scope', '$window', 'User', 'Bundle', function ($routeParams, $location, $scope, $window, User, Bundle) {
  Bundle.get($routeParams.id).then(function () {
    $scope.model = arguments[0];
  }).catch(function () {
    $location.path('/packages');
  });

  $scope.getPriceRange = Bundle.getPriceRange;
  
  $scope.buyBundle = function (option) {
    option.$isPending = true;
    Bundle.buy({
      'bundleId': $scope.model.id,
      'bundleOptionId': option.id,
      'bundleRecordId': option.$selected.id,
      'paymentMethod': 'PAYPAL',
      'payerInfo': {
        'email': User.model.email,
        'name': User.getFullName()
      }
    }).then(function (model) {
      option.$isPending = false;
      $window.location.href = model.paypalUrl;
    });
  };
}])
.controller('PackagesCtrl', ['$scope', 'User', 'Bundle', function($scope, User, Bundle) {
  User.getCustomer()
      .then(Bundle.get)
      .then(function (bundles) {
        $scope.collection = bundles;
      });

  $scope.haveBundle = function (bundle) {
    return !!getSubscription(bundle);
  };

  $scope.bundleExpiryDate = function (bundle) {
    var subscription = getSubscription(bundle);
    if (subscription.infinity) {
      return 'Never';
    }
    var date = new Date(subscription.expiryDate);
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
  };

  $scope.getPriceRange = Bundle.getPriceRange;

  function getSubscription(bundle) {
    var customer = User.customer, n = 0;
    if(Array.isArray(customer.subscriptions)) {
      n = customer.subscriptions.length;
    }
    while(n--) {
      var subscription = customer.subscriptions[n];
      if(subscription.bundleId === bundle.id) {
        return subscription;
      }
    }
    return false;
  }
}]);