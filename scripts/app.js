'use strict';

/**
 * @ngdoc overview
 * @name iicaFrontendApp
 * @description
 * # iicaFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('iica', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
    ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });