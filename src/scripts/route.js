'use strict';
var fs = require('fs');

/**
 * Represents the route configuration.
 * @param {$RouteProvider} $routeProvider
 */
function Route($routeProvider) {
  $routeProvider.when('/', {
    controller: 'TestController',
    template: fs.readFileSync(__dirname + '/../views/test-view.html')
  }).otherwise({
    redirectTo: '/'
  });
}

module.exports = ['$routeProvider', Route];
