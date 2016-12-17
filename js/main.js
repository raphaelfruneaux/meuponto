(function () {
  "use strict";

  function CounterController($scope, $filter, $interval) {
    var vm = this;

    vm.saldo = { total: '', sinal: '' }

    Date.prototype.today = function () {
      return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
    }

    Date.prototype.timeNow = function () {
      return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
    }

    var dataStorage = JSON.parse(localStorage.getItem("pontoEletronico"));
    if (!dataStorage) {
      var pontoEletronico = { user: {} };
      pontoEletronico.user.name = prompt("Informe o seu nome:");
      pontoEletronico.user.email = prompt("Informe o seu email:");
      pontoEletronico.user.registros = [];
      pontoEletronico.user.saldo = { total: '', sinal: '' };
      localStorage.setItem("pontoEletronico", JSON.stringify(pontoEletronico));
    } else {
      var pontoEletronico = dataStorage;
      initializeSaldo();
    }

    var date = new Date();
    var today = date.toISOString().match(/\d{4}-\d{2}-\d{2}/).join('-');
    var current = $filter('filter')(pontoEletronico.user.registros, { date: today })[0];

    if (!current || current.length < 1) {
      var registro = {
        date: today,
        pontos: [],
        feriado: false
      };
      current = registro;
      pontoEletronico.user.registros.push(registro);
      localStorage.setItem("pontoEletronico", JSON.stringify(pontoEletronico));
    }

    $scope.ponto = '';
    $scope.pontos = current.pontos;
    $scope.current = current;
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

        var day = $filter('filter')(pontoEletronico.user.registros, { date: arg.date })[0];
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


      if (horasTrabalhadas === undefined || horasTrabalhadas == 0)
        return 0

      var jornada = "0h";

      if (!current.hasOwnProperty('feriado') || current.feriado == false) {
        if (date.getDay() != 0 && date.getDay() != 6) {
          jornada = (date.getDay() == 5) ? "8h" : "9h"
        }

        if ($scope.pontos.length == 1) {
          jornada = hmh.sum(jornada + " 1h").toString();
        }

        var horarioDiff = hmh.sub(jornada + " " + horasTrabalhadas);

        if (vm.verificaHoraExtra() > 0) {
          return horarioAtual
        }

        return hmh.sum(horarioAtual + " " + horarioDiff).toString() || 0;
      }

      return horarioAtual;
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
      var registro = r || current;
      if (registro === undefined || registro.pontos.length == 0)
        return 0
      var horasTrabalhadas = vm.horasTrabalhadas(registro.pontos);
      var d = new Date(registro.date.split('-')[0], registro.date.split('-')[1] - 1, registro.date.split('-')[2]);
      var jornada = (d.getDay() == 5) ? "8h" : (d.getDay() == 6 || registro.feriado) ? "0h" : "9h";
      var extra = hmh.diff(jornada, horasTrabalhadas);
      registro.extra = extra.toString();
      return extra.toString() || 0;
    };

    vm.verificaHoraExtra = function (r) {
      var r = r || current;
      if (r === undefined || r.pontos.length == 0)
        return 0
      var horasExtra = vm.totalHoraExtra(r);
      var regex = /\-/;
      if (regex.test(horasExtra)) {
        return -1;
      } else if (horasExtra == 0) {
        return 0;
      } else {
        return 1;
      }
    };

    vm.preparaSaldo = function () {
      if (pontoEletronico.user.hasOwnProperty('saldo')) {
        if (!pontoEletronico.user.saldo.total || !pontoEletronico.user.saldo.sinal) {
          return false;
        }

        var sinal = pontoEletronico.user.saldo.sinal == 'N' ? '-' : '';

        return {
          toString: function () { return sinal + toHMH(pontoEletronico.user.saldo.total) },
          isNegative: function () { return pontoEletronico.user.saldo.sinal == 'N' },
          total: pontoEletronico.user.saldo.total
        }
      } 
      return false
    }

    vm.bancoDeHorasTotal = function () {
      var registrosCredito = [];
      var registroDebito = [];

      var subtotal = null;
      var total = null;
      var saldo = vm.preparaSaldo();

      var dataBase = today.split('-');
      var mesAtual = parseInt(dataBase[1]);

      angular.forEach(pontoEletronico.user.registros, function (item) {
        if (item.date != today) {
          if (/\-/.test(item.extra)) {
            registroDebito.push(item.extra);
          } else {
            registrosCredito.push(item.extra);
          }
        }
      });

      if (saldo) {
        if (saldo.isNegative()) {
          registroDebito.push(saldo.toString())
        } else {
          registrosCredito.push(saldo.toString())
        }
      }

      var credito = hmh.sum(registrosCredito, 'minutes').toString() || 0;
      var debito = hmh.sum(registroDebito, 'minutes').toString() || 0;

      total = hmh.sub(credito + " " + debito);
      
      return total

    };

    vm.bancoDeHorasMes = function () {
      var registrosCredito = [];
      var registroDebito = [];

      var dataBase = today.split('-');
      var mesRef = dataBase[2] >= 21 ? parseInt(dataBase[1]) + 1 : parseInt(dataBase[1]);

      var mesMin = (mesRef == 1) ? 12 : (mesRef - 1);
      mesMin = (mesMin < 10) ? "0" + mesMin : mesMin;

      var mesMax = (mesRef < 12) ? (mesRef + 1) : 1;
      mesMax = (mesMax < 10) ? "0" + mesMax : mesMax;

      var dataMin = dataBase[0] + '-' + mesMin + '-21';
      var dataMax = dataBase[0] + '-' + mesRef + '-20';

      angular.forEach(pontoEletronico.user.registros, function (item) {
        if (item.date != today && item.date >= dataMin && item.date <= dataMax) {
          if (/\-/.test(item.extra)) {
            registroDebito.push(item.extra);
          } else {
            registrosCredito.push(item.extra);
          }
        }
      });

      var credito = hmh.sum(registrosCredito, 'minutes').toString() || 0;
      var debito = hmh.sum(registroDebito, 'minutes').toString() || 0;

      vm.periodo = {};
      vm.periodo.min = dataMin;
      vm.periodo.max = dataMax;

      return hmh.sub(credito + " " + debito);
    };

    vm.verificaBancoDeHoras = function () {
      return 0;
    };

    vm.showInputPonto = function (arg) {
      $('.input.input-ponto.' + arg)
        .transition('fade right')
        .find('input')
        .focus()
        ;
    };

    vm.showInputPonto = function (arg) {
      $('.input.input-ponto.' + arg)
        .transition('fade right')
        .find('input')
        .focus()
        ;
    };

    vm.marcarComoFeriado = function (r) {
      registro = r || current
      if (typeof registro === 'object') {
        registro.feriado = true;
        save()
      }
    };

    vm.desmarcarComoFeriado = function (r) {
      registro = r || current
      if (typeof registro === 'object') {
        registro.feriado = false;
        save()
      }
    };

    vm.isDescanso = function (r) {
      registro = r || current;
      var d = new Date(registro.date.split('-')[0], registro.date.split('-')[1] - 1, registro.date.split('-')[2]);
      return (d.getDay() == 6) || (d.getDay() == 0);
    };

    vm.modalAdicionarHoras = function () {
      $('[data-modal="adicionar-horas"]').modal({
        blurring: true
      }).modal('show');
    };

    vm.fechaModalAdicionarHoras = function (form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
        initializeSaldo();
      }

      $('[data-modal="adicionar-horas"]').modal('hide');
    };

    vm.salvarSaldoAnterior = function () {
      if (!vm.saldo.total || !vm.saldo.sinal) {
        return false
      }

      if (!pontoEletronico.user.hasOwnProperty('saldo')) {
        pontoEletronico.user.saldo = { total: '', sinal: ''}
      }

      console.log(vm.saldo.total);

      pontoEletronico.user.saldo.total = formatPonto(angular.copy(vm.saldo.total.replace(/[^\d]/g, '')));
      pontoEletronico.user.saldo.sinal = angular.copy(vm.saldo.sinal);
      
      save();

      vm.fechaModalAdicionarHoras();
    };

    vm.resetSaldo = function (form) {
      if (pontoEletronico.user.hasOwnProperty('saldo')) {
        delete pontoEletronico.user.saldo
      }

      if (form) {
        form.$setPristine();
        form.$setUntouched();
        initializeSaldo();
      }

      save();
      
      vm.fechaModalAdicionarHoras();
    };

    $interval(atualizaHorario, 1000);

    function atualizaHorario() {
      return $scope.horarioAtual = new Date().timeNow();
    }

    function calcularHorasTrabalhadas(pontos) {
      var diffs = [];
      for (var i in pontos) {
        if (i % 2 != 0) {
          diffs.push(hmh.diff(toHMH(pontos[i - 1]), toHMH(pontos[i])).toString().replace(/\s+/g, ''));
        }
      }
      return hmh.sum(diffs).toString() || 0;
    }

    function formatPonto(p) {
      return p.charAt(0) + p.charAt(1) + ":" + p.charAt(2) + p.charAt(3);
    }

    function toHMH(p) {
      p = p.match(/\d+/g).join('');
      return p.charAt(0) + p.charAt(1) + "h" + p.charAt(2) + p.charAt(3) + "m";
    }

    function save() {
      localStorage.setItem("pontoEletronico", JSON.stringify(pontoEletronico));
    }

    function initializeSaldo() {
      if (!pontoEletronico.user.hasOwnProperty('saldo')) {
        pontoEletronico.user.saldo = { total: '', sinal: '' };
      }
      vm.saldo.total = pontoEletronico.user.saldo.total;
      vm.saldo.sinal = pontoEletronico.user.saldo.sinal;
    }
  };

  CounterController.$inject = ['$scope', '$filter', '$interval'];

  angular.module('myApp', ['ui.mask']).controller('CounterController', CounterController);

})();
