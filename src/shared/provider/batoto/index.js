'use strict';
var regex = /^http:\/\/bato\.to\/comic\/_\/comics\/(.*)-r([0-9]+)/i;
var Series = require('./series');

/**
 * Retrieves a series.
 * @param {string} location
 * @return {Series}
 */
module.exports = function (location) {
    return regex.test(location) ? new Series(location) : undefined;
};
