'use strict';
var Page = require('./page');

/**
 * Represents a chapter.
 * @class
 * @param {!Array.<string>} identifier
 * @param {string} location
 * @param {number} number
 * @param {?string} title
 * @param {number} volume
 */
function Chapter(identifier, location, number, title, volume) {
    this.identifier = identifier ? parseInt(identifier[1], 10) : undefined;
    this.location = location;
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
    var location = /[0-9]+\.html$/i.test(this.location) ?
        this.location :
        this.location + '1.html';
    var select = $('select.m').first();
    return select.find('option:not(:last-child)').map(function (i, el) {
        var next = $(el).text() + '.html';
        var page = new Page(location.replace(/[0-9]+\.html$/i, next));
        if (i === 0) {
            page.imageLocation = page.imageLocation($);
            delete page.location;
        }
        return page;
    }).get();
};

if (typeof module !== 'undefined') {
    module.exports = Chapter;
}
