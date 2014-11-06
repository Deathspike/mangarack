'use strict';
var xml2js = require('xml2js');

/**
 * Represents metadata.
 * @param {Series=} series
 * @param {Chapter=} chapter
 * @class
 */
function Meta(series, chapter) {
    if (series && chapter) {
        copyValidValues(this, {
            genre: series.genres.join(', '),
            number: !isNaN(chapter.number) ? chapter.number : undefined,
            manga: 'YesAndRightToLeft',
            penciller: series.artists.join(', '),
            series: series.title,
            summary: series.summary,
            title: chapter.title,
            volume: !isNaN(chapter.volume) ? chapter.volume : undefined,
            writer: series.authors.join(', ')
        });
    }
}

/**
 * Add a page to the metadata.
 * @param {string} key
 * @param {number=} number
 * @param {boolean} isFrontCover
 */
Meta.prototype.add = function (key, number, isFrontCover) {
    this.pages = this.pages || {page: []};
    this.pages.page.push({
        $: copyValidValues({
            key: key,
            image: number || 0,
            type: isFrontCover ? 'FrontCover' : undefined
        })
    });
};

/**
 * Export metadata.
 * @return {string}
 */
Meta.prototype.export = function () {
    var clone = cloneWithCamelCaseKeys(this);
    var builder = new xml2js.Builder({
        rootName: 'ComicInfo',
        xmldec: {version: '1.0', encoding: 'utf-8'}
    });
    clone.$ = {
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
    };
    return builder.buildObject(clone);
};

/**
 * Import metadata.
 * @param {string} xml
 * @return {Promise}
 */
Meta.prototype.import = function (xml) {
    var that = this;
    return new Promise(function (resolve, reject) {
        xml2js.parseString(xml, {
            explicitArray: false,
            explicitRoot: false,
            tagNameProcessors: [function (name) {
                return name.charAt(0).toLowerCase() + name.substr(1);
            }]
        }, function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            copyValidValues(that, {
                genre: String(result.genres || '').split(', '),
                number: Number(result.number),
                manga: 'YesAndRightToLeft',
                penciller: String(result.artists || '').split(', '),
                series: String(result.title),
                summary: String(result.summary),
                title: String(result.title),
                volume: Number(result.volume),
                writer: String(result.authors || '').split(', ')
            });
            resolve();
        });
    });
};

/**
 * Clones the object with camel-case keys.
 * @param {!Object} source
 */
function cloneWithCamelCaseKeys(source) {
    var result = Array.isArray(source) ? [] : {};
    Object.keys(source).forEach(function (key) {
        var titleCaseKey = key.charAt(0).toUpperCase() + key.substr(1);
        result[titleCaseKey] = typeof source[key] === 'object' ?
            cloneWithCamelCaseKeys(source[key]) :
            source[key];
    });
    return result;
}

/**
 * Copy valid values from the source to the destination.
 * @param {Object=} destination
 * @param {!Object} source
 * @return {!Object}
 */
function copyValidValues(destination, source) {
    if (typeof source === 'undefined') {
        source = destination;
        destination = {};
    }
    Object.keys(source).forEach(function (key) {
        var value = source[key];
        if (typeof value !== 'undefined' && !/^\s*$/.test(value)) {
            destination[key.charAt(0).toLowerCase() + key.substr(1)] = value;
        }
    });
    return destination;
}

if (typeof module !== 'undefined') {
    module.exports = Meta;
}
