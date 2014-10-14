'use strict';
var Chapter = require('./chapter');

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
    return $('a[href*=\'/search/artist/\']').map(function (i, el) {
        return $(el).text().trim() || undefined;
    }).get();
};

/**
 * Retrieves each author.
 * @param {?} $
 * @return {!Array.<string>}
 */
Series.prototype.authors = function ($) {
    return $('a[href*=\'/search/author/\']').map(function (i, el) {
        return $(el).text().trim() || undefined;
    }).get();
};

/**
 * Retrieves each child.
 * @param {?} $
 * @return {!Array.<Chapter>}
 */
Series.prototype.children = function ($) {
    var regex = /id=([0-9]+)/i;
    var results = [];
    $('h3.volume').each(function (i, el) {
        var match = $(el).text().match(/^Volume\s(.+)$/i);
        if (match) {
            var parent = $(el).parent();
            parent.next().find('a[href*=\'/manga/\']').each(function (i, el) {
                results.push(new Chapter(
                    (parent.prev('a.edit').attr('href') || '').match(regex),
                    ($(el).attr('href') || '').trim(),
                    parseFloat($(el).text().match(/[0-9\.]+$/)),
                    $(el).next('span.title').text().trim() || undefined,
                    parseFloat(match[1])
                ));
            });
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
    return $('a[href*=\'/search/genres/\']').map(function (i, el) {
        return $(el).text().trim() || undefined;
    }).get();
};

/**
 * Retrieves the image location.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.imageLocation = function ($) {
    var location = $('img[src*=\'cover.jpg\']').attr('src');
    return location ? location.trim() : undefined;
};

/**
 * Retrieves the summary.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.summary = function ($) {
    var isComplete;
    var result = '';
    $('p.summary').text().split('\n').filter(function (piece) {
        return !/:$/i.test(piece) &&
            !/^From\s+(.+)$/i.test(piece) &&
            !/^\(Source:\s+(.+)\)/i.test(piece);
    }).forEach(function (piece) {
        if (isComplete || (!piece.trim() && result)) {
            isComplete = true;
            return false;
        }
        result += piece.trim();
        return true;
    });
    return result || undefined;
};

/**
 * Retrieves the title.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.title = function ($) {
    var match = $('title').text().match(/^(.+)\s+Manga\s+-/i);
    return match ? match[1].trim() : undefined;
};

if (typeof module !== 'undefined') {
    module.exports = Series;
}
