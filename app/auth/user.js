'use strict';

angular.module('myApp.auth')
.service('User', ['$http', '$rootScope', 'apiUrl', function ($http, $rootScope, apiUrl) {
    var user = {}, storageSettings = {
        token: 'token',
        customer: 'customerId'
    };

    user.model = {};

    user.registration = function (user_info) {
        user_info.language = 'en_GB';
        user_info.requireConfirmation = false;
        return $http.post(apiUrl + user.urls.register_user, user_info).then(function (response) {
            response.data.data = {
                token: response.data.data.token,
                user: response.data.data
            };
            setSession(response);
            return user.getInfo();
        });
    };

    user.login = function (credentials) {
        return $http.post(apiUrl + user.urls.login_user, credentials).then(function (response) {
            setSession(response);
            return user.getInfo();
        });
    };

    user.getInfo = function () {
        restoreSession();
        return $http.get(apiUrl + user.urls.get_user_info).then(function (response) {
            user.model = response.data.data.user;
            $rootScope.$broadcast(user.update_broadcast);
        }).catch(function () {
            clearSession();
        });
    };

    user.getCustomer = function () {
        var customerId = sessionStorage.getItem(storageSettings.customer);
        return $http.get(apiUrl + user.urls.get_customer + '/' + customerId).then(function (response) {
            user.customer = response.data.data;
        });
    };

    user.logout = function () {
        return $http.post(apiUrl + user.urls.logout_user).finally(function () {
            clearSession();
        });
    };
    
    user.getFullName = function () {
        return user.model.firstName + ' ' + user.model.lastName;
    };

    function restoreSession() {
        var token = sessionStorage.getItem(storageSettings.token),
            customer = sessionStorage.getItem(storageSettings.customer);

        if(token) {
            $http.defaults.headers.common.Authorization = 'Token ' + token;
        }
        if(customer) {
            $http.defaults.headers.common['X-Customer-Id'] = customer;
        }
    }

    function setSession(response) {
        sessionStorage.setItem(storageSettings.token, response.data.data.token);
        sessionStorage.setItem(storageSettings.customer, response.data.data.user.customers[0].customerId);
    }

    function clearSession() {
        user.model = {};
        sessionStorage.removeItem(storageSettings.token);
        sessionStorage.removeItem(storageSettings.customer);
        $http.defaults.headers.common.Authorization = '';
        $http.defaults.headers.common['X-Customer-Id'] = '';
    }

    // User constants
    user.update_broadcast = 'user-updated';
    user.urls = {
        login_user: '/users/login',
        logout_user: '/users/logout',
        get_user_info: '/users/authInfo',
        get_customer: '/customers',
        register_user: '/registration'
    };

    return user;
}]);