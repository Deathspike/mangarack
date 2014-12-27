'use strict';

/**
 * Represents a page.
 * @constructor
 * @implements {IPage}
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
 * @returns {(?string|Array.<string>)}
 */
Page.prototype.imageAddress = function($) {
  return $('img[alt*=\'Batoto!\']').attr('src') || undefined;
};

module.exports = Page;
