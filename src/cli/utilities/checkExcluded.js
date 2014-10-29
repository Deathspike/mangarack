'use strict';

/**
 * Determines if the chapter is excluded.
 * @param {!{chapter: ?number, volume: ?number}} options
 * @param {!{chapter: number, volume: number}} chapter
 * @return {boolean}
 */
module.exports = function (options, chapter) {
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
