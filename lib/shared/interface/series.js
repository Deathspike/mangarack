/*jshint -W098*/
'use strict';

/**
 * Represents a series.
 * @interface
 */
function ISeries() {
  throw new Error('Not implemented.');
}

// --

/**
 * Contains the address.
 * @type {string}
 */
ISeries.address = String();

// --

/**
 * Retrieves each artist.
 * @param {?} $
 * @return {!Array.<string>}
 */
ISeries.prototype.artists = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves each author.
 * @param {?} $
 * @return {!Array.<string>}
 */
ISeries.prototype.authors = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves each child.
 * @param {?} $
 * @return {!Array.<IChapter>}
 */
ISeries.prototype.children = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves each genre.
 * @param {?} $
 * @return {!Array.<string>}
 */
ISeries.prototype.genres = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves the image address.
 * @param {?} $
 * @return {?string}
 */
ISeries.prototype.imageAddress = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves the summary.
 * @param {?} $
 * @return {?string}
 */
ISeries.prototype.summary = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves the title.
 * @param {?} $
 * @return {?string}
 */
ISeries.prototype.title = function($) {
  throw new Error('Not implemented.');
};

// --

module.exports = ISeries;
