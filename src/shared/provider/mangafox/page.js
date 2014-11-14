'use strict';

/**
 * Represents a page.
 * @class
 * @param {string} address
 * @param {number} number
 */
function Page(address) {
    this.address = address;
    this.number = number;
}

/**
 * Retrieves the image address.
 * @param {?} $
 * @return {Array.<string>}
 */
Page.prototype.imageAddress = function ($) {
    var thumbnail = $('meta[property=\'og:image\']').attr('content');
    if (thumbnail) {
        var image = thumbnail.replace('thumbnails/mini.', 'compressed/');
        return [image, image.replace('http://l.', 'http://z.')];
    }
    return undefined;
};

if (typeof module !== 'undefined') {
    module.exports = Page;
}
