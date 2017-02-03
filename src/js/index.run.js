(function () {
  'use strict';

  angular.module('meuponto-app').run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $state) {
    // $rootScope.$on('$stateChangeStart', function (event, toState) {
    //   if ('isSecurity' in toState && toState.isSecurity) {
    //     if (!AuthService.isAuthenticated()) {
    //       event.preventDefault();
    //       $rootScope.$evalAsync(function () {
    //         $state.go('login');
    //       });
    //     }
    //   }
    // });
  }

})();
