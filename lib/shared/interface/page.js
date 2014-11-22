/*jshint -W027, -W098*/
'use strict';

/**
 * Represents a page.
 * @interface
 */
function IPage() {
    throw new Error('Not implemented.');
}

// --

/**
 * Contains the address.
 * @type {string}
 */
IPage.address = String();

/**
 * Contains the number.
 * @type {number}
 */
IPage.number = Number();

// --

/**
 * Retrieves the image address.
 * @param {?}
 * @return {(?string|Array.<string>)}
 */
IPage.imageAddress = function ($) {
    throw new Error('Not implemented.');
    return [];
};

// --

module.exports = IPage;
