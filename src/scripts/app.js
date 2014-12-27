'use strict';
var app = angular.module('app', ['ngRoute']);

// Controllers
app.controller('TestController', require('./controllers/test-controller'));

// Configuration
app.config(require('./route'));

// Services
app.service('TestService', require('./services/test-service'));

// Run
app.run();
