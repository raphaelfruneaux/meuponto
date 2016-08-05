(function () {
  "use strict";

  angular.module('myApp', ['ui.mask']).controller('CounterController', CounterController);

  CounterController.$inject = ['$scope', '$filter', '$interval'];

  function CounterController ($scope, $filter, $interval) {
    var vm = this;

		Date.prototype.today = function () {
	    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
		}

		Date.prototype.timeNow = function () {
	    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
		}

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

		var date = new Date();
    var today = date.toISOString().match(/\d{4}-\d{2}-\d{2}/).join('-');
    var current = $filter('filter')(pontoEletronico.user.registros, {date: today})[0];

    if (!current || current.length < 1) {
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
    $scope.dataAtual = date;
		$scope.horarioAtual = date.timeNow();
    $scope.pontoEletronico = pontoEletronico;
    $scope.showInputPonto = false;
    $scope.horario_anterior = {};

    vm.addPonto = function (arg) {
      if (arg) {
        arg.pontos.push(formatPonto(angular.copy($scope.horario_anterior[arg.date])));
        $scope.horario_anterior[arg.date] = '';
        console.log(arg.pontos);
        // buscar pontoEletronico de LocalStorage
        // filtrar os registros pela data
        // atualizar o valor do registro encontrado no item 2
        // persistir em local storage again
      } else {
        if ($scope.ponto.horario) {
          $scope.pontos.push(formatPonto(angular.copy($scope.ponto.horario)));
          $scope.ponto = '';
          localStorage.setItem("pontoEletronico", JSON.stringify(pontoEletronico));
        }
      }
    };

    vm.horasTrabalhadas = function (p) {
      var pontos = (p) ? p : $scope.pontos;
      var pontosAux = angular.copy(pontos);

			if (pontosAux.length % 2 != 0) {
				pontosAux.push(angular.copy($scope.horarioAtual).match(/\d{2}:\d{2}/).join(':'));
			}

      return calcularHorasTrabalhadas(pontosAux);
    };

    vm.totalHorasTrabalhadas = function (p) {
      var pontos = (p) ? p : $scope.pontos;
      var pontosAux = angular.copy(pontos);
      return calcularHorasTrabalhadas(pontosAux);
    };

    vm.showInputPonto = function (arg) {
      $('.input.input-ponto.' + arg)
        .transition('fade right')
        .find('input')
        .focus()
      ;
    }

		$interval(atualizaHorario, 1000);

    function atualizaHorario () {
      return $scope.horarioAtual = new Date().timeNow();
    }

    function calcularHorasTrabalhadas (pontos) {
      var diffs = [];
      for (var i in pontos) {
        if (i % 2 != 0) {
          diffs.push(hmh.diff(toHMH(pontos[i-1]), toHMH(pontos[i])).toString().replace(/\s+/g, ''));
        }
      }
      return hmh.sum(diffs).toString() || 0;
    }

    function formatPonto (p) {
      return p.charAt(0) + p.charAt(1) + ":" + p.charAt(2) + p.charAt(3);
    }

    function toHMH (p) {
      p = p.match(/\d+/g).join('');
      return p.charAt(0) + p.charAt(1) + "h" + p.charAt(2) + p.charAt(3) + "m";
    }
  };
})();
