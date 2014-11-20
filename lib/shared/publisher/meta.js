'use strict';
var xml2js = require('xml2js');

/**
 * Represents metadata.
 * @class
 * @param {!Series} series
 * @param {!Chapter} chapter
 */
function Meta(series, chapter) {
    this.genre = series.genres.join(', ');
    this.number = !isNaN(chapter.number) ? chapter.number : undefined;
    this.penciller = series.artists.join(', ');
    this.pages = {page: []};
    this.series = series.title;
    this.summary = series.summary;
    this.title = chapter.title;
    this.volume = !isNaN(chapter.volume) ? chapter.volume : undefined;
    this.writer = series.authors.join(', ');
}

/**
 * Add a page to the metadata.
 * @param {string} key
 * @param {?number} number
 */
Meta.prototype.add = function (key, number) {
    this.pages.page.push({$: {
        key: key,
        image: isNaN(number) ? 0 : number || 0,
        type: Boolean(number) ? undefined : 'FrontCover'
    }});
};

/**
 * Export metadata to xml.
 * @return {string}
 */
Meta.prototype.xml = function () {
    return new xml2js.Builder({
        rootName: 'ComicInfo',
        xmldec: {version: '1.0', encoding: 'utf-8'}
    }).buildObject(map(this));
};

/**
 * Map the source to a duplicate with title case keys.
 * @param {(!Array.<!Object>|!Object)} src
 * @return {(!Array.<!Object>|!Object)}
 */
function map(src) {
    var res = Array.isArray(src) ? [] : {};
    Object.keys(src).forEach(function (x) {
        if (typeof src[x] === 'undefined') return;
        var title = x.charAt(0).toUpperCase() + x.substr(1);
        res[title] = typeof src[x] === 'object' ? map(src[x]) : src[x];
    });
    return res;
}

module.exports = Meta;
