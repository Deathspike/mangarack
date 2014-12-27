'use strict';
var fs = require('fs');

/**
 * Represents the route configuration.
 * @param {$RouteProvider} $routeProvider
 */
function Route($routeProvider) {
  $routeProvider.when('/home', {
    controller: 'HomeController',
    template: fs.readFileSync(__dirname + '/../views/home-view.html')
  }).otherwise({
    redirectTo: '/home'
  });
}

module.exports = ['$routeProvider', Route];
