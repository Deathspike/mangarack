'use strict';

/**
 * Represents a page.
 * @class
 * @param {string} location
 */
function Page(location) {
    this.location = location;
}

/**
 * Retrieves the image location.
 * @param {?} $
 * @return {Array.<string>}
 */
Page.prototype.imageLocation = function ($) {
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
