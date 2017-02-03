(function () {

  angular.module('meuponto-controllers').controller('HomeController', homeController);

  /** @ngInject */
  function homeController ($scope, $rootScope, $log) {
    $log.info(':: called homeController');
  }

})();
