'use strict';
var fs = require('fs');

/**
 * Determines if the chapter is a duplicate.
 * @param {!Options} options
 * @param {string} alias
 * @param {function(Error, ?boolean)} done
 */
module.exports.duplicate = function (options, alias, done) {
    if (options.duplicate) {
        return process.nextTick(function () {
            done(undefined, false);
        });
    }
    fs.exists(alias, function (exists) {
        done(undefined, exists);
    });
};

/**
 * Determines if the chapter is excluded.
 * @param {!Options} options
 * @param {!Chapter} chapter
 * @return {boolean}
 */
module.exports.excluded = function (options, chapter) {
    if (typeof chapter.number === 'number' &&
        !isNaN(chapter.number) &&
        ((options.chapter < 0 && chapter.number >= Math.abs(options.chapter)) ||
        (options.chapter > 0 && chapter.number <= options.chapter))) {
        return true;
    }
    if (typeof chapter.volume === 'number' &&
        !isNaN(chapter.volume) &&
        ((options.volume < 0 && chapter.volume >= Math.abs(options.volume)) ||
        (options.volume > 0 && chapter.volume <= options.volume))) {
        return true;
    }
    return false;
};
