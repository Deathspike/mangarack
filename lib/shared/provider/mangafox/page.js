'use strict';

/**
 * Represents a page.
 * @constructor
 * @implements {IPage}
 * @param {string} address
 * @param {number} number
 */
function Page(address, number) {
  this.address = address;
  this.number = number;
}

/**
 * Retrieves the image address.
 * @param {?} $
 * @return {(?string|Array.<string>)}
 */
Page.prototype.imageAddress = function($) {
  var image = $('#viewer img').attr('src');
  if (!image) return undefined;
  return [image.trim(), image.trim().replace('http://l.', 'http://z.')];
};

module.exports = Page;
