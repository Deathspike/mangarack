'use strict';

/**
 * Represents the test controller.
 * @constructor
 * @param {Object} $scope
 * @param {TestService} testService
 */
function TestController($scope, testService) {
  $scope.message = testService.formatMessage('Deathspike');
}

module.exports = ['$scope', 'TestService', TestController];
