'use strict';
var alter = require('./alter');
var batoto = require('./batoto');
var kissmanga = require('./kissmanga');
var mangafox = require('./mangafox');

/**
 * Retrieves a series.
 * @param {string} location
 * @return {Series}
 */
module.exports = function (location) {
    var series = batoto(location) || kissmanga(location) || mangafox(location);
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
