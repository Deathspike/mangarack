'use strict';
var Chapter = require('./chapter');
var scanner = require('../scanner');

/**
 * Represents a series.
 * @param {string} location
 */
function Series(location) {
    this.location = location;
}

/**
 * Retrieves each artist.
 * @param {?} $
 * @return {!Array.<string>}
 */
Series.prototype.artists = function ($) {
    return $('td:contains(Artist:)+ > a').map(function (i, el) {
        return $(el).text().trim() || undefined;
    }).get();
};

/**
 * Retrieves each author.
 * @param {?} $
 * @return {!Array.<string>}
 */
Series.prototype.authors = function ($) {
    return $('td:contains(Author:)+ > a').map(function (i, el) {
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
    $('tr.lang_English').find('a[href*=\'/read/\']').map(function (i, el) {
        var scan = scanner($(el).text());
        var location = ($(el).attr('href') || '').trim();
        var identifier = location.match(/_\/([0-9]+)\//i);
        if (location && scan && identifier) {
            results.push(new Chapter(
                identifier,
                location,
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
    return $('td:contains(Genres:)+ > a').map(function (i, el) {
        return $(el).text().trim() || undefined;
    }).get();
};

/**
 * Retrieves the image location.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.imageLocation = function ($) {
    var location = $('img[src*=\'/uploads/\']').first().attr('src');
    return location ? location.trim() : undefined;
};

/**
 * Retrieves the summary.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.summary = function ($) {
    var html = $('td:contains(Description:)').next().html() || '';
    var text = $('<div />').html(html.replace(/<br\s*\/?>/g, '\n')).text();
    return text || undefined;
};

/**
 * Retrieves the title.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.title = function ($) {
    return $('h1.ipsType_pagetitle').text().trim() || undefined;
};

if (typeof module !== 'undefined') {
    module.exports = Series;
}
