'use strict';
var alter = require('./alter');
var batoto = require('./batoto');
var kissmanga = require('./kissmanga');
var mangafox = require('./mangafox');
var providers = [batoto, kissmanga, mangafox];

/**
 * Retrieves a series.
 * @param {string} address
 * @returns {ISeries}
 */
module.exports = function(address) {
  var series;
  providers.every(function(provider) {
    series = provider(address);
    return !Boolean(series);
  });
  if (series) series.children = _createAlter(series.children);
  return series;
};

/**
 * Adds a provider.
 * @param {function(string): Series} provider
 */
module.exports.add = function(provider) {
  providers.push(provider);
};

/**
 * Creates a function to alter the children.
 * @private
 * @param {function(!Object)} populate
 * @returns {function(!Object)}
 */
function _createAlter(populate) {
  return function($) {
    var children = populate($);
    alter(children);
    return children;
  };
}
