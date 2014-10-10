'use strict';
var Page = require('./page');

/**
 * Represents a chapter.
 * @class
 * @param {Array.<string>} identifier
 * @param {string} location
 * @param {number} number
 * @param {?string} title
 * @param {number} volume
 */
function Chapter(identifier, location, number, title, volume) {
    this.identifier = identifier ? parseInt(identifier[1], 10) : undefined;
    this.location = location + '?supress_webtoon=t';
    this.number = number;
    this.title = title;
    this.volume = volume;
}

/**
 * Retrieves each child.
 * @returns {!Array.<Page>}
 */
Chapter.prototype.children = function ($) {
    return $('select[name=page_select]:first > option').map(function (i, el) {
        var value = $(el).attr('value');
        var page = value ? new Page(value) : undefined;
        if (i === 0 && page) {
            page.imageLocation = page.imageLocation($);
            page.location = null;
        }
        return page;
    }).get();
};

if (typeof module !== 'undefined') {
    module.exports = Chapter;
}
