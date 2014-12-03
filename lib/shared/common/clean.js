'use strict';

/**
 * Cleans the value from unsupported characters.
 * @param {?string} value
 * @return {?string}
 */
module.exports = function(value) {
  var out = (value || '').replace(/["<>\|:\*\?\\\/]/g, '').replace(/\.*$/, '');
  return out || undefined;
};
