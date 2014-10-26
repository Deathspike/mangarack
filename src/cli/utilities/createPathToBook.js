'use strict';

/**
 * Creates a path to a book.
 * @param {!{title: ?string}} series
 * @param {!{number: number, volume: number}} chapter
 * @param {string=} extension
 * @return {?string}
 */
module.exports = function (series, chapter, extension) {
    var name = invalidate(series.title);
    if (name) {
        var number = '#' + prefix(stripSuffix(chapter.number.toFixed(4)), 3);
        var suffix = '.' + (extension || 'cbz');
        if (isNaN(chapter.volume)) {
            return name + '/' + name + ' ' + number + suffix;
        } else {
            var volume = prefix(String(chapter.volume), 2);
            return name + '/' + name + ' V' + volume + ' ' + number + suffix;
        }
    }
    return undefined;
};

/**
 * Invalidate the path.
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
 * Strip a value from a zero-padding suffix.
 * @param {string} value
 * @return {string}
 */
function stripSuffix(value) {
    return value.replace(/\.0+$/g, '');
}
