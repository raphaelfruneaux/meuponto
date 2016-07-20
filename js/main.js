
var myApp = angular.module('myApp',['ui.mask']);

myApp.controller('CounterController', ['$scope', '$filter', function($scope, $filter) {
	// {
  //   "user": {
  //       "id": 1,
  //       "nome": "Fulano de Tal",
  //       "email": "emaildefulano@tenta.ai",
  //       "registros": [{
  //           "dia": "2016-07-20",
  //           "pontos": []
  //       },]
  //   },
	// }

	var dataStorage = JSON.parse(localStorage.getItem("pontoEletronico"));
	if (!dataStorage) {
			var pontoEletronico = {user: {}};
			pontoEletronico.user.name = prompt("Informe o seu nome:");
			pontoEletronico.user.email = prompt("Informe o seu email:");
			pontoEletronico.user.registros = [];
			localStorage.setItem("pontoEletronico", JSON.stringify(pontoEletronico));
	} else {
		var pontoEletronico = dataStorage;
	}

	var today = new Date().toISOString().match(/\d{4}-\d{2}-\d{2}/).join('-');
	var current = $filter('filter')(pontoEletronico.user.registros, {date: today})[0];

	if (current.length < 1) {
		var registro = {
			date: today,
			pontos: []
		};
		current = registro;
		pontoEletronico.user.registros.push(registro);
		localStorage.setItem("pontoEletronico", JSON.stringify(pontoEletronico));
	}

	$scope.ponto = '';
	$scope.pontos = current.pontos;

	$scope.addPonto = function () {
  	if ($scope.ponto) {
	  	$scope.pontos.push(formatPonto(angular.copy($scope.ponto)));
			$scope.ponto = '';
			localStorage.setItem("pontoEletronico", JSON.stringify(pontoEletronico));
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
