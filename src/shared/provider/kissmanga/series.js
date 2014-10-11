'use strict';
var Chapter = require('./chapter');
var scanner = require('../scanner');

/**
 * Represents a series.
 * @param {string} location
 */
function Series(location) {
    this.location = /\?confirm=yes$/i.test(location) ?
        location :
        location + '?confirm=yes';
}

/**
 * Retrieves each author.
 * @param {?} $
 * @return {!Array.<string>}
 */
Series.prototype.authors = function ($) {
    return $('a[href*=\'/AuthorArtist/\']').map(function (i, el) {
        return $(el).text().trim() || undefined;
    }).get();
};

/**
 * Retrieves each child.
 * @param {?} $
 * @return {!Array.<Chapter>}
 */
Series.prototype.children = function ($) {
    var results = [];
    $('a[href*=\'/Manga/\'][title*=\'Read\']').map(function (i, el) {
        var scan = scanner($(el).text().replace(/\.0+/, '.'));
        var location = ($(el).attr('href') || '').trim();
        var identifier = location.match(/id=([0-9]+)$/i);
        if (location && scan && identifier) {
            results.push(new Chapter(
                identifier,
                'http://kissmanga.com/' + location.replace(/^\//, ''),
                scan.number,
                scan.title || undefined,
                scan.volume
            ));
        }
    });
    return results.reverse();
};

/**
 * Retrieves each genre.
 * @param {?} $
 * @return {!Array.<string>}
 */
Series.prototype.genres = function ($) {
    return $('a[href*=\'/Genre/\']').map(function (i, el) {
        return $(el).text().trim() || undefined;
    }).get();
};

/**
 * Retrieves the image location.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.imageLocation = function ($) {
    return ($('img[src*=\'/Uploads/\']').attr('src') || '').trim() || undefined;
};

/**
 * Retrieves the summary.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.summary = function ($) {
    var text = $('span:contains(Summary:)').parent().next().text();
    return text ? text.trim() : undefined;
};

/**
 * Retrieves the title.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.title = function ($) {
    var match = $('title').text().match(/^(.+)\s+Manga\s+\|/i);
    return match && match[1] ? match[1].trim() : undefined;
};

if (typeof module !== 'undefined') {
    module.exports = Series;
}
