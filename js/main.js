var myApp = angular.module('myApp',['ui.mask']);

myApp.controller('CounterController', ['$scope', function($scope) {
  $scope.teste = function() {
  	console.log("OPAAA");
  }
}]);