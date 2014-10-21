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
    var address = /[0-9]+\.html$/i.test(this.address) ?
        this.address :
        this.address + '1.html';
    var select = $('select.m').first();
    return select.find('option:not(:last-child)').map(function (i, el) {
        var next = $(el).text() + '.html';
        var page = new Page(address.replace(/[0-9]+\.html$/i, next));
        if (i === 0) {
            page.imageAddress = page.imageAddress($);
            delete page.address;
        }
        return page;
    }).get();
};

if (typeof module !== 'undefined') {
    module.exports = Chapter;
}