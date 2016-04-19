'use strict';

angular.module('myApp.packages')
.service('Bundle', ['$http', '$rootScope', 'apiUrl', function ($http, $rootScope, apiUrl) {
    var bundle = {};

    bundle.get = function (id) {
        id = id ? '/' + id : '';
        return $http.get(apiUrl + bundle.urls.get + id).then(function (response) {
            return response.data.data;
        });
    };

    bundle.buy = function (option) {
        return $http.post(apiUrl + bundle.urls.buy, option).then(function (response) {
            return response.data;
        });
    };
    
    bundle.getPriceRange = function (bundle, _option) {
        _option = _option || false;
        var min = Number.MAX_VALUE,
            max = Number.MIN_VALUE,
            n = 0;
        if(Array.isArray(bundle.bundleOptions)) {
            n = bundle.bundleOptions.length;
        }
        while(n--) {
            var option = bundle.bundleOptions[n],
                j = 0;
            if(_option && _option !== option) {
                continue;
            }
            if(Array.isArray(option.records)) {
                j = option.records.length;
            }
            while(j--) {
                var record = option.records[j];
                if(record.price < min) {
                    min = record.price;
                }
                if(record.price > max) {
                    max = record.price;
                }
            }
        }
        min = (min < 0 || min === Number.MAX_VALUE) ? 0 : min;
        max = (max === min || max === Number.MIN_VALUE) ? false : max;
        bundle.$isFree = min === 0;

        return min + (max ? ' - ' + max : '');
    };

    bundle.urls = {
        get: '/bundles',
        buy: '/bundles/buy'
    };

    return bundle;
}]);