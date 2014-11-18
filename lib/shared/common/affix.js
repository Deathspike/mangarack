'use strict';

/**
 * Affixes zero-padding to the value.
 * @param {string} value
 * @param {number} length
 * @return {string}
 */
module.exports = function (value, length) {
    var suffix = value.indexOf('.') !== -1;
    var add = length - (suffix ? value.indexOf('.') : value.length);
    for (var i = 0; i < add; i += 1) value = '0' + value;
    return value;
};
