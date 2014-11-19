'use strict';
var Page = require('./page');

/**
 * Represents a chapter.
 * @class
 * @param {string} address
 * @param {Array.<string>} identifier
 * @param {number} number
 * @param {?string} title
 * @param {number} volume
 */
function Chapter(address, identifier, number, title, volume) {
    this.address = address + '?supress_webtoon=t';
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
    var select = $('select[name=page_select]').first();
    return select.find('option').map(function (i, el) {
        var page = new Page($(el).attr('value'), i + 1);
        if (i === 0) {
            page.imageAddress = page.imageAddress($);
            page.address = undefined;
        }
        return page;
    }).get();
};

module.exports = Chapter;
