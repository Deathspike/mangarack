'use strict';
var regex = /^http:\/\/bato\.to\/comic\/_\/comics\/(.*)-r([0-9]+)/i;
var Series = require('./series');

/**
 * Retrieves a series.
 * @param {string} address
 * @return {Series}
 */
module.exports = function (address) {
    return regex.test(address) ? new Series(address) : undefined;
};
