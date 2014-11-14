'use strict';

/**
 * The regular expression.
 * @const
 */
var expression = new RegExp('\\s*' +
    // The volume expression [1].
    '(?:Vol\\.?\\s*([0-9\\.]+)\\s*)?' +
    // The chapter expression [2].
    '(?:Ch\\.?)?[a-z]*\\s*((?:[0-9\\.]+[a-u]?)\\s*(?:Extra)?\\s*(?:Omake)?)' +
    // The dash versioning skip expression.
    '(?:\\s*-\\s*[0-9\\.]+)?' +
    // The versioning skip expression.
    '(?:\\s*v\\.?[0-9]+)?' +
    // The part expression [3].
    '(?:\\s*\\(?Part\\s*([0-9]+)\\)?)?' +
    // The dash/plus skip expression.
    '(?:\\s*(?:-|\\+))?' +
    // The title expression [4].
    '(?:\\s*\\:?\\s*(?:Read Onl?ine|([\\w\\W]*)))?' +
    // The whitespace expression.
    '\\s*$', 'i');

/**
 * Scans the input for chapter details.
 * @param {string} input
 * @return {{number: number, title: ?string, volume: number}}
 */
module.exports = function (input) {
    var match = input.match(expression);
    return !match ? undefined : {
        number: parse(match[2], match[3]),
        title: (match[4] || '').trim() || undefined,
        volume: parseFloat(match[1])
    };
};

/**
 * Parses the chapter and part to a number.
 * @param {string} chapter
 * @param {string} part
 * @returns {number}
 */
function parse(chapter, part) {
    var match = chapter.match(/([a-u])$/);
    var mutation = 0;
    if (match) mutation = (match[1].charCodeAt(0) - 96) / 10;
    else if (part) mutation = parseFloat(part) / 10;
    return parseFloat(chapter) + mutation;
}
