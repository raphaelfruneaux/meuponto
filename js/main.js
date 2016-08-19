(function () {
  "use strict";

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
        if (!$scope.horario_anterior[arg.date]) {
          alert('Insira um valor!');
          return false;
        }

        var day = $filter('filter')(pontoEletronico.user.registros, {date: arg.date})[0];
        day.pontos.push(formatPonto(angular.copy($scope.horario_anterior[arg.date])));
        localStorage.setItem("pontoEletronico", JSON.stringify(pontoEletronico));
        $scope.horario_anterior[arg.date] = '';
        vm.showInputPonto(arg.date);
      } else {
        if ($scope.ponto.horario) {
          $scope.pontos.push(formatPonto(angular.copy($scope.ponto.horario)));
          $scope.ponto = '';
          localStorage.setItem("pontoEletronico", JSON.stringify(pontoEletronico));
        }
      }
    };

    vm.saidaSugerida = function () {
      var horarioAtual = toHMH($scope.horarioAtual);
      var horasTrabalhadas = vm.horasTrabalhadas();
      var jornada = (date.getDay() == 5) ? "8h" : "9h";
      var horarioDiff = hmh.sub(jornada + " " + horasTrabalhadas);
      return hmh.sum(horarioAtual + " " + horarioDiff).toString() || 0;
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

    vm.totalHoraExtra = function (r) {
      var horasTrabalhadas = vm.horasTrabalhadas(r.pontos);
      var d = new Date(r.date.split('-')[0], r.date.split('-')[1] - 1, r.date.split('-')[2]);
      var jornada = (d.getDay() == 5) ? "8h" : "9h";
      var extra = hmh.diff(jornada, horasTrabalhadas);
      r.extra = extra;
      return extra.toString() || 0;
    };

    vm.verificaHoraExtra = function (r) {
      var horasExtra = vm.totalHoraExtra(r);
      var regex = /\-/;
      if (regex.test(horasExtra)) {
        return -1;
      } else if (horasExtra == 0) {
        return 0;
      } else {
        return 1;
      }
    }

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

  CounterController.$inject = ['$scope', '$filter', '$interval'];

  angular.module('myApp', ['ui.mask']).controller('CounterController', CounterController);

})();
