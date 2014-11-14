'use strict';

/**
 * Represents a page.
 * @class
 * @param {string} address
 * @param {number} number
 */
function Page(address, number) {
    this.imageAddress = address;
    this.number = number;
}

if (typeof module !== 'undefined') {
    module.exports = Page;
}
