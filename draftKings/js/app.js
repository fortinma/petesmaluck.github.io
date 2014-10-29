'use strict';

 /* App Module */

var app = angular.module('myApp.service',['myApp.service']);


app.config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/main.html',
        controller: 'Players'
      }).
      otherwise({
         redirectTo: '/'
       });
   });
