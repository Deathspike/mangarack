'use strict';

/**
 * Affixes zero-padding to the value.
 * @param {string} value
 * @param {number} number
 * @return {string}
 */
module.exports = function (value, number) {
    var withSuffix = value.indexOf('.') !== -1;
    while (withSuffix ? value.indexOf('.') < 2 : value.length < number) {
        value = '0' + value;
    }
    return value;
};
