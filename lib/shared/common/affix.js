'use strict';

/**
 * Affixes zero-padding to the value.
 * @param {(number|string)} value
 * @param {number} length
 * @return {string}
 */
module.exports = function(value, length) {
  if (typeof value !== 'string') value = String(value);
  var suffix = value.indexOf('.') !== -1;
  var add = length - (suffix ? value.indexOf('.') : value.length);
  while ((add -= 1) >= 0) value = '0' + value;
  return value;
};
