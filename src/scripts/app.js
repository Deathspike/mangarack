'use strict';
var app = angular.module('app', ['ngRoute']);

// Controllers
app.controller('HomeController', require('./controllers/home-controller'));

// Configuration
app.config(require('./route'));

// Services
app.service('SettingsService', require('./services/settings-service'));

// Run
app.run();
