'use strict';
var Page = require('./page');

/**
 * Represents a chapter.
 * @class
 * @param {string} address
 * @param {!Array.<string>} identifier
 * @param {number} number
 * @param {?string} title
 * @param {number} volume
 */
function Chapter(address, identifier, number, title, volume) {
    this.address = address;
    this.identifier = identifier ? parseInt(identifier[1], 10) : undefined;
    this.number = number;
    this.title = title;
    this.volume = volume;
}

/**
 * Retrieves each child.
 * @param {?} $
 * @return {!Array.<Page>}
 */
Chapter.prototype.children = function ($) {
    var match;
    var regex = /lstImages\.push\("(.+?)"\)/gi;
    var results = [];
    var text = $('script:contains(lstImages)').text();
    while ((match = regex.exec(text)) !== null) {
        results.push(new Page(match[1]));
    }
    return results;
};

if (typeof module !== 'undefined') {
    module.exports = Chapter;
}
