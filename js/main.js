
var myApp = angular.module('myApp',['ui.mask']);

myApp.controller('CounterController', ['$scope', function($scope) {
	console.log(hmh);
	
	$scope.ponto = '';
	$scope.pontos = [];

	$scope.addPonto = function () {
  	if ($scope.ponto) {
	  	$scope.pontos.push(formatPonto(angular.copy($scope.ponto)));
			$scope.ponto = '';
  	}
  };

	$scope.horasTrabalhadas = function () {
		var diffs = [];

		for (i in $scope.pontos) {
			if (i % 2 != 0) {
				diffs.push(hmh.diff(toHMH($scope.pontos[i-1]), toHMH($scope.pontos[i])).toString().replace(/\s+/g, ''));
			}
		}

		return hmh.sum(diffs).toString() || 0;
	};

	function formatPonto (p) {
  	return p.charAt(0) + p.charAt(1) + ":" + p.charAt(2) + p.charAt(3);
  }

	function toHMH (p) {
		p = p.match(/\d+/g).join('');
		return p.charAt(0) + p.charAt(1) + "h" + p.charAt(2) + p.charAt(3) + "m";
	}
}]);
