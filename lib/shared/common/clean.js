'use strict';

/**
 * Cleans the value from unsupported characters.
 * @param {?string} value
 * @returns {?string}
 */
module.exports = function(value) {
  return (value || '')
    .replace(/["<>\|:\*\?\\\/]/g, '')
    .replace(/\.$/, '. (Suffixed)') || undefined;
};
