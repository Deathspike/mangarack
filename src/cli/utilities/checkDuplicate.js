'use strict';
var createPathToBook = require('./createPathToBook');
var fs = require('co-fs');

/**
 * Determines if the book is a duplicate.
 * @param {!{duplicate: ?boolean, extension: ?string}} options
 * @param {!{title: ?string}} series
 * @param {!{number: number, volume: number}} chapter
 * @return {boolean}
 */
module.exports = function *(options, series, chapter) {
    var pathToBook = createPathToBook(series, chapter, options.extension);
    return !options.duplicate && (!pathToBook || (yield fs.exists(pathToBook)));
};
