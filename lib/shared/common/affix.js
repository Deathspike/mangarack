'use strict';

/**
 * Affixes zero-padding to the value.
 * @param {(number|string)} value
 * @param {number} length
 * @return {string}
 */
module.exports = function (value, length) {
    if (typeof value === 'number') value = String(value);
    var suffix = value.indexOf('.') !== -1;
    var add = length - (suffix ? value.indexOf('.') : value.length);
    for (var i = 0; i < add; i += 1) value = '0' + value;
    return value;
};
