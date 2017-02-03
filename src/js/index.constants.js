(function () {
  'use strict';

  var FIREBASE_CONF = {
    apiKey: "AIzaSyAG7SiJpRPyCuNKOnC3MWh3bsxrjF3MkX8",
    authDomain: "meuponto-22c8a.firebaseapp.com",
    databaseURL: "https://meuponto-22c8a.firebaseio.com",
    storageBucket: "meuponto-22c8a.appspot.com",
    messagingSenderId: "453391659544"
  };

  angular
    .module('meuponto-app')
    .constant('FIREBASE_CONF', FIREBASE_CONF);

})();
