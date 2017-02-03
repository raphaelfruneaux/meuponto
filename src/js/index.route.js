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

    // var loginRoute = {
    //   name: 'login',
    //   url: '/auth/login',
    //   templateUrl: 'views/login.html',
    //   controller: 'AuthController',
    //   controllerAs: 'auth'
    // }

    $stateProvider
      .state(homeRoute);
      // .state(loginRoute);

    $urlRouterProvider.otherwise('/');
  }

})();
