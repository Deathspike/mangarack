'use strict';

/**
 * Represents a page.
 * @class
 * @param {string} address
 */
function Page(address) {
    this.address = address + '?supress_webtoon=t';
}

/**
 * Retrieves the image address.
 * @param {?} $
 * @return {?string}
 */
Page.prototype.imageAddress = function ($) {
    return $('img[alt*=\'Batoto!\']').attr('src');
};

if (typeof module !== 'undefined') {
    module.exports = Page;
}
