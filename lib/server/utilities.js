'use strict';
var fs = require('fs');

/**
 * Determines if the chapter exists.
 * @param {!IOptions} options
 * @param {string} chapterPath
 * @param {function(?boolean)} done
 */
module.exports.exists = function(options, chapterPath, done) {
  if (options.duplicate) return done(false);
  fs.exists(chapterPath, done);
};

/**
 * Determines if the chapter is excluded with a filter.
 * @param {!IOptions} options
 * @param {!IChapter} chapter
 * @return {boolean}
 */
module.exports.excluded = function(options, chapter) {
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
