    var module = angular.module("sampleApp", ['ngRoute']);

    module.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/route1', {
                    templateUrl: 'view.html',
                    controller: 'RouteController'
                }).
                when('/route2', {
                    templateUrl: 'view2.html',
                    controller: 'RouteController'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }]);

    module.controller("RouteController", function($scope) {

    });