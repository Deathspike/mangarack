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
 * @returns {(?string|Array.<string>)}
 */
Page.prototype.imageAddress = function($) {
  var viewer = $('#viewer img:not(.loadingImg)');
  var address = viewer.attr('src');
  if (!address) return undefined;
  var alternativeAddress = viewer.attr('onerror').match(/^this.src='(.*)'$/);
  if (!alternativeAddress || address === alternativeAddress[1]) return undefined;
  return [address, alternativeAddress[1]];
};

module.exports = Page;
