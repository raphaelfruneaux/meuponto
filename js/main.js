var myApp = angular.module('myApp',['ui.mask']);

myApp.controller('CounterController', ['$scope', function($scope) {
	$scope.ponto = '';
	$scope.pontos = [];
  $scope.addPonto = function() {
  	if ($scope.ponto) {
	  	$scope.pontos.push($scope.ponto);
	  	$scope.ponto = '';
  	}
  }
}]);