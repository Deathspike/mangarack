'use strict';

/**
 * Represents a page.
 * @class
 * @param {string} location
 */
function Page(location) {
    this.location = location + '?supress_webtoon=t';
}

/**
 * Retrieves the image location.
 * @returns {?string}
 */
Page.prototype.imageLocation = function ($) {
    return $('img[alt*=\'Batoto!\']').attr('src');
};

if (typeof module !== 'undefined') {
    module.exports = Page;
}
