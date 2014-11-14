'use strict';
var affix = require('./affix');

/**
 * Creates an alias for the chapter.
 * @param {!{title: ?string}} series
 * @param {!{number: number, volume: number}} chapter
 * @param {string=} extension
 * @return {?string}
 */
module.exports = function (series, chapter, extension) {
    var name = invalidate(series.title);
    if (!name) return undefined;
    var number = '#' + affix(stripSuffix(chapter.number.toFixed(4)), 3);
    var prefix = name + '/' + name + ' ';
    var suffix = number + '.' + (extension || 'cbz');
    if (isNaN(chapter.volume)) return prefix + suffix;
    return prefix + 'V' + affix(String(chapter.volume), 2) + ' ' + suffix;
};

/**
 * Invalidates the value.
 * @param {string} value
 * @return {string}
 */
function invalidate(value) {
    return value.replace(/["<>\|:\*\?\\\/]/g, '');
}

/**
 * Strips a suffix from the zero-padded value.
 * @param {string} value
 * @return {string}
 */
function stripSuffix(value) {
    return value.replace(/\.0+$/g, '');
}
