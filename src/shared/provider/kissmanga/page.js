'use strict';

/**
 * Represents a page.
 * @class
 * @param {string} imageLocation
 */
function Page(imageLocation) {
    this.imageLocation = imageLocation;
}

if (typeof module !== 'undefined') {
    module.exports = Page;
}
