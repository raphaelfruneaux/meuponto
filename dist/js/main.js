"use strict";
"use strict";
'use strict';(function(){'use strict';angular.module('meuponto-app',[// 'ngAnimate',
// 'ngSanitize',
// 'ngAria',
'ui.router','meuponto-controllers','meuponto-directives','meuponto-filters','meuponto-services']);angular.module('meuponto-controllers',[]);angular.module('meuponto-directives',[]);angular.module('meuponto-filters',[]);angular.module('meuponto-services',[])})();
'use strict';(function(){'use strict';
routerConfig.$inject = ["$stateProvider", "$urlRouterProvider"];angular.module('meuponto-app').config(routerConfig);/** @ngInject */function routerConfig($stateProvider,$urlRouterProvider){var homeRoute={name:'home',url:'/',templateUrl:'views/home.html',controller:'HomeController',controllerAs:'home',isSecurity:true};// var loginRoute = {
//   name: 'login',
//   url: '/auth/login',
//   templateUrl: 'views/login.html',
//   controller: 'AuthController',
//   controllerAs: 'auth'
// }
$stateProvider.state(homeRoute);// .state(loginRoute);
$urlRouterProvider.otherwise('/')}})();
'use strict';(function(){'use strict';
runBlock.$inject = ["$rootScope", "$state"];angular.module('meuponto-app').run(runBlock);/** @ngInject */function runBlock($rootScope,$state){// $rootScope.$on('$stateChangeStart', function (event, toState) {
//   if ('isSecurity' in toState && toState.isSecurity) {
//     if (!AuthService.isAuthenticated()) {
//       event.preventDefault();
//       $rootScope.$evalAsync(function () {
//         $state.go('login');
//       });
//     }
//   }
// });
}})();
'use strict';(function(){
homeController.$inject = ["$scope", "$rootScope", "$log", "$state"];angular.module('meuponto-controllers').controller('HomeController',homeController);/** @ngInject */function homeController($scope,$rootScope,$log,$state){$log.info(':: called homeController')}})();