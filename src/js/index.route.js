(function () {
  'use strict';

  angular.module('meuponto-app').config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    var homeRoute = {
      name: 'home',
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeController',
      controllerAs: 'home',
      isSecurity: true
    };

    $stateProvider
      .state(homeRoute);

    $urlRouterProvider.otherwise('/');
  }

})();
