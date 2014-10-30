'use strict';

/**
 * Affixes zero-padding to the value.
 * @param {string} value
 * @param {number} length
 * @return {string}
 */
module.exports = function (value, length) {
    var withSuffix = value.indexOf('.') !== -1;
    while (withSuffix ? value.indexOf('.') < length : value.length < length) {
        value = '0' + value;
    }
    return value;
};
