'use strict';

/**
 * Represents a page.
 * @class
 * @param {?string|Array.<string>} address
 * @param {number} number
 */
function Page(address, number) {
    this.imageAddress = address;
    this.number = number;
}

module.exports = Page;
