'use strict';
var alter = require('./alter');
var batoto = require('./batoto');
var kissmanga = require('./kissmanga');
var mangafox = require('./mangafox');
var providers = [batoto, kissmanga, mangafox];

/**
 * Retrieves a series.
 * @param {string} address
 * @return {ISeries}
 */
module.exports = function (address) {
    var series;
    providers.every(function (provider) {
        series = provider(address);
        return !Boolean(series);
    });
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

/**
 * Adds a provider.
 * @param {function(string): Series} provider
 */
module.exports.add = function (provider) {
    providers.push(provider);
};
