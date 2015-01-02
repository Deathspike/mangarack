'use strict';
var Series = require('./series');

/**
 * Retrieves a series.
 * @param {string} address
 * @returns {ISeries}
 */
module.exports = function(address) {
  return /^http:\/\/kissmanga\.com\/Manga\//i.test(address) ?
    new Series(address) :
    undefined;
};
