'use strict';
var alias = require('../../shared').common.alias;
var fs = require('co-fs');

/**
 * Determines if the chapter is a duplicate.
 * @param {!{duplicate: ?boolean, extension: ?string}} options
 * @param {!{title: ?string}} series
 * @param {!{number: number, volume: number}} chapter
 * @return {boolean}
 */
module.exports = function *(options, series, chapter) {
    var path = alias(series, chapter, options.extension);
    return !options.duplicate && (!path || (yield fs.exists(path)));
};
