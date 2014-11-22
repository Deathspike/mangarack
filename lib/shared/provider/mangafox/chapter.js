'use strict';
var Page = require('./page');

/**
 * Represents a chapter.
 * @constructor
 * @implements {IChapter}
 * @param {string} address
 * @param {Array.<string>} identifier
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
 * @return {!Array.<!IPage>}
 */
Chapter.prototype.children = function ($) {
    var address = /[0-9]+\.html$/i.test(this.address) ?
        this.address :
        this.address + '1.html';
    var select = $('select.m').first();
    return select.find('option:not(:last-child)').map(function (i, el) {
        var next = $(el).text() + '.html';
        var page = new Page(address.replace(/[0-9]+\.html$/i, next), i + 1);
        if (i === 0) {
            page.imageAddress = page.imageAddress($);
            page.address = undefined;
        }
        return page;
    }).get();
};

module.exports = Chapter;
