'use strict';

/**
 * Represents a page.
 * @class
 * @param {(?string|Array.<string>)} imageAddress
 * @param {number} number
 */
function Page(imageAddress, number) {
    this.imageAddress = imageAddress;
    this.number = number;
}

module.exports = Page;
