'use strict';

/**
 * The regular expression.
 * @const
 */
var regexp = new RegExp('\\s*' +
  // The volume expression [1].
  '(?:Vol\\.?\\s*([0-9\\.]+)\\s*)?' +
  // The chapter expression [2].
  '(?:(?:Ch|Ep)\\.?)?[a-z]*\\s*(?:([0-9\\.]+[a-u]?)\\s*(?:Extra)?\\s*(?:Omake)?)' +
  // The dash versioning skip expression.
  '(?:\\s*-\\s*[0-9\\.]+)?' +
  // The versioning expression [3].
  '(?:\\s*v\\.?([0-9]+))?' +
  // The part expression [4].
  '(?:\\s*\\(?Part\\s*([0-9]+)\\)?)?' +
  // The dash/plus skip expression.
  '(?:\\s*(?:-|\\+))?' +
  // The title expression [5].
  '(?:\\s*\\:?\\s*(?:Read Onl?ine|([\\w\\W]*)))?' +
  // The whitespace expression.
  '\\s*$', 'i');

/**
 * Scans the input for chapter details.
 * @param {string} input
 * @returns {!{number: number, title: ?string, version: number, volume: number}}
 */
module.exports = function(input) {
  var match = input.match(regexp);
  return match ? {
    number: _parse(match[2], match[4]),
    title: (match[5] || '').trim() || undefined,
    version: parseFloat(match[3]),
    volume: parseFloat(match[1])
  } : undefined;
};

/**
 * Parses the chapter and part to a number.
 * @private
 * @param {string} chapter
 * @param {string} part
 * @returns {number}
 */
function _parse(chapter, part) {
  var match = chapter.match(/([a-u])$/);
  var mutation = 0;
  if (match) {
    mutation = (match[1].charCodeAt(0) - 96) / 10;
  } else if (part) {
    mutation = parseFloat(part) / 10;
  }
  return parseFloat(chapter) + mutation;
}
