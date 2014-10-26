'use strict';
var fs = require('co-fs');

/**
 * Generates a path and ensures it can be written.
 * @param {!Series} series
 * @param {!Chapter} chapter
 * @param {string=} extension
 * @return {?string}
 */
module.exports = function *(series, chapter, extension) {
    var path = invalidate(series.title || '');
    if (path) {
        var exists = yield fs.exists(path);
        if (!exists) {
            yield fs.mkdir(path);
        }
        return generate(series, chapter) + '.' + (extension || 'cbz');
    }
};

/**
 * Generate a path.
 * @param {!Sereis} series
 * @param {!Chapter} chapter
 * @return {?string}
 */
function generate(series, chapter) {
    var name = invalidate(series.title);
    var number = prefix(suffix(String(chapter.number.toFixed(4))), 3);
    if (isNaN(chapter.volume)) {
        return name + '/' + name + ' #' + number;
    } else {
        var volume = prefix(String(chapter.volume), 2);
        return name + '/' + name + ' V' + volume + ' #' + number;
    }
}

/**
 * Invalidate the value.
 * @param {string} path
 * @return {string}
 */
function invalidate(path) {
    return path.replace(/["<>\|:\*\?\\\/]/g, '');
}

/**
 * Prefix a value with zero-padding.
 * @param {string} value
 * @param {number} number
 * @return {string}
 */
function prefix(value, number) {
    var withSuffix = value.indexOf('.') !== -1;
    while (withSuffix ? value.indexOf('.') < 2 : value.length < number) {
        value = '0' + value;
    }
    return value;
}

/**
 * Strip a value from zero-padding.
 * @param {string} value
 * @return {string}
 */
function suffix(value) {
    return value.replace(/\.0+$/g, '');
}
