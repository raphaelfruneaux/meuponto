var myApp = angular.module('myApp',['ui.mask']);

myApp.controller('CounterController', ['$scope', function($scope) {
	$scope.ponto = '';
	$scope.pontos = [];
  $scope.addPonto = function() {
  	console.log($scope.ponto);
  	$scope.pontos.push($scope.ponto);
  	console.log($scope.pontos);
  	$scope.ponto = '';
  }
}]);