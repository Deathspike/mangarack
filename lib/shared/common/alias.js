'use strict';
var affix = require('./affix');
var clean = require('./clean');

/**
 * Creates an alias chapter name for the chapter.
 * @param {!ISeries} series
 * @param {!IChapter} chapter
 * @param {string} extension
 * @returns {?string}
 */
module.exports = function(series, chapter, extension) {
  if (isNaN(chapter.number)) return undefined;
  var name = clean(series.title);
  if (!name) return undefined;
  var number = '#' + affix(_stripSuffix(chapter.number.toFixed(4)), 3);
  var suffix = number + '.' + extension;
  if (isNaN(chapter.volume)) return name + ' ' + suffix;
  return name + ' V' + affix(String(chapter.volume), 2) + ' ' + suffix;
};

/**
 * Strips a suffix from the zero-padded value.
 * @private
 * @param {string} value
 * @returns {string}
 */
function _stripSuffix(value) {
  return value.replace(/\.?0+$/g, '');
}
