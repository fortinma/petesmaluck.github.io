var playerStats = angular.module('myApp', ['myApp.service']);

playerStats.controller('Players', function($scope, $http) {
  
  $scope.orderByField = 'University';
  $scope.reverseSort = false;

  $http.get('stats.json')
       .then(function(res){
          $scope.data = res.data;                
        });


});