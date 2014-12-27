'use strict';

/**
 * Represents the test service.
 * @constructor
 */
function TestService() {}

/**
 * Format a message.
 * @param {string} name
 * @returns {string}
 */
TestService.prototype.formatMessage = function(name) {
  return 'Hello, ' + name;
};

module.exports = TestService;
