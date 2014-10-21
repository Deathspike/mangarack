'use strict';

/**
 * Represents a page.
 * @class
 * @param {string} address
 */
function Page(address) {
    this.imageAddress = address;
}

if (typeof module !== 'undefined') {
    module.exports = Page;
}
