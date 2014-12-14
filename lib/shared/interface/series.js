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
ISeries.artists = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves each author.
 * @param {?} $
 * @return {!Array.<string>}
 */
ISeries.authors = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves each child.
 * @param {?} $
 * @return {!Array.<IChapter>}
 */
ISeries.children = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves each genre.
 * @param {?} $
 * @return {!Array.<string>}
 */
ISeries.genres = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves the image address.
 * @param {?} $
 * @return {?string}
 */
ISeries.imageAddress = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves the summary.
 * @param {?} $
 * @return {?string}
 */
ISeries.summary = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves the title.
 * @param {?} $
 * @return {?string}
 */
ISeries.title = function($) {
  throw new Error('Not implemented.');
};

/**
 * Retrieves the type.
 * @param {?} $
 * @return {?string}
 */
ISeries.type = function($) {
  throw new Error('Not implemented.');
};

// --

module.exports = ISeries;
