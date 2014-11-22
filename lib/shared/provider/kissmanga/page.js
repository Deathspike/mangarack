'use strict';

/**
 * Represents a page.
 * @constructor
 * @implements {IPage}
 * @param {(?string|Array.<string>)} imageAddress
 * @param {number} number
 */
function Page(imageAddress, number) {
    this.imageAddress = imageAddress;
    this.number = number;
}

module.exports = Page;
