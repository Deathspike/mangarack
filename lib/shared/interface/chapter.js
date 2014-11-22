/*jshint -W027, -W098*/
'use strict';

/**
 * Represents a chapter.
 * @interface
 */
function IChapter() {
    throw new Error('Not implemented.');
}

// --

/**
 * Contains the address.
 * @type {string}
 */
IChapter.address = String();

/**
 * Contains the identifier.
 * @type {?string}
 */
IChapter.identifier = String();

/**
 * Contains the number.
 * @type {number}
 */
IChapter.number = Number();

/**
 * Contains the title.
 * @type {?string}
 */
IChapter.title = String();

/**
 * Contains the number.
 * @type {number}
 */
IChapter.volume = Number();

// --

/**
 * Retrieves each child.
 * @param {?} $
 * @return {!Array.<!IPage>}
 */
IChapter.prototype.children = function ($) {
    throw new Error('Not implemented.');
    return [];
};

// --

module.exports = IChapter;