'use strict';

/**
 * Affixes zero-padding to the value.
 * @param {string} value
 * @param {number} length
 * @return {string}
 */
module.exports = function (value, length) {
    var suffix = value.indexOf('.') !== -1;
    while (suffix ? value.indexOf('.') < length : value.length < length) {
        value = '0' + value;
    }
    return value;
};
