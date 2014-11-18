'use strict';
var alter = require('./alter');
var batoto = require('./batoto');
var kissmanga = require('./kissmanga');
var mangafox = require('./mangafox');

/**
 * Retrieves a series.
 * @param {string} address
 * @return {Series}
 */
module.exports = function (address) {
    var series = batoto(address) || kissmanga(address) || mangafox(address);
    if (series) {
        var populate = series.children;
        series.children = function ($) {
            var children = populate($);
            alter(children);
            return children;
        };
    }
    return series;
};
