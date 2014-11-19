'use strict';

/**
 * Represents a page.
 * @class
 * @param {string} address
 * @param {number} number
 */
function Page(address, number) {
    this.address = address + '?supress_webtoon=t';
    this.number = number;
}

/**
 * Retrieves the image address.
 * @param {?} $
 * @return {?string|Array.<string>}
 */
Page.prototype.imageAddress = function ($) {
    return $('img[alt*=\'Batoto!\']').attr('src') || undefined;
};

module.exports = Page;
