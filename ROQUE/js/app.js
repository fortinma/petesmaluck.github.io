'use strict';

 /* App Module */

var app = angular.module('myApp',[]);


app.config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html'
      }).
       when('/services', {
        templateUrl: 'partials/services.html'
      }).
       when('/references', {
        templateUrl: 'partials/references.html'
      }).
       when('/insurance', {
        templateUrl: 'partials/insurance.html'
      }).
       when('/safety', {
        templateUrl: 'partials/safety.html'
      }).
      otherwise({
         redirectTo: '/'
       });
   });
