var myApp = angular.module('myApp',['ui.mask']);

myApp.controller('CounterController', ['$scope', function($scope) {
	$scope.ponto = '';
	$scope.pontos = [];
  $scope.addPonto = function() {
  	if ($scope.ponto) {
	  	$scope.pontos.push(formatPonto());
	  	$scope.ponto = '';
  	}
  }
  function formatPonto() {
  	return $scope.ponto.charAt(0) + $scope.ponto.charAt(1) + ":" + $scope.ponto.charAt(2) + $scope.ponto.charAt(3);
  }
}]);