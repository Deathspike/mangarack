'use strict';
var Chapter = require('./chapter');

/**
 * Represents a series.
 * @constructor
 * @implements {ISeries}
 * @param {string} address
 */
function Series(address) {
  this.address = address;
}

/**
 * Retrieves each artist.
 * @param {?} $
 * @returns {!Array.<string>}
 */
Series.prototype.artists = function($) {
  return $('a[href*=\'/search/artist/\']').map(function(i, el) {
    return $(el).text().trim() || undefined;
  }).get();
};

/**
 * Retrieves each author.
 * @param {?} $
 * @returns {!Array.<string>}
 */
Series.prototype.authors = function($) {
  return $('a[href*=\'/search/author/\']').map(function(i, el) {
    return $(el).text().trim() || undefined;
  }).get();
};

/**
 * Retrieves each child.
 * @param {?} $
 * @returns {!Array.<!IChapter>}
 */
Series.prototype.children = function($) {
  var regex = /id=([0-9]+)/i;
  var results = [];
  $('h3.volume').each(function(i, el) {
    var match = $(el).text().trim().match(/^Volume\s(.+)$/i);
    if (!match) return;
    $(el).parent().next().find('a[href*=\'/manga/\']').each(function(i, el) {
      results.push(new Chapter(
        ($(el).attr('href') || '').trim(),
        ($(el).parent().prev('a.edit').attr('href') || '').match(regex),
        parseFloat($(el).text().match(/[0-9\.]+$/)),
        $(el).next('span.title').text().trim() || undefined,
        parseFloat(match[1])
      ));
    });
  });
  return results.reverse();
};

/**
 * Retrieves each genre.
 * @param {?} $
 * @returns {!Array.<string>}
 */
Series.prototype.genres = function($) {
  return $('a[href*=\'/search/genres/\']').map(function(i, el) {
    return $(el).text().trim() || undefined;
  }).get();
};

/**
 * Retrieves the image address.
 * @param {?} $
 * @returns {?string}
 */
Series.prototype.imageAddress = function($) {
  var address = $('img[src*=\'cover.jpg\']').attr('src');
  return address ? address.trim() : undefined;
};

/**
 * Retrieves the summary.
 * @param {?} $
 * @returns {?string}
 */
Series.prototype.summary = function($) {
  var result = '';
  $('p.summary').text().split('\n').filter(function(piece) {
    piece = piece.trim();
    return !/:$/i.test(piece) &&
      !/^From\s+(.+)$/i.test(piece) &&
      !/^\(Source:\s+(.+)\)/i.test(piece);
  }).every(function(piece) {
    if (!piece.trim() && result) return false;
    result += piece.trim();
    return true;
  });
  return result || undefined;
};

/**
 * Retrieves the title.
 * @param {?} $
 * @returns {?string}
 */
Series.prototype.title = function($) {
  var match = $('title').text().match(/^(.+)\s+Manga\s+-/i);
  return match ? match[1].trim() : undefined;
};

/**
 * Retrieves the type.
 * @param {?} $
 * @returns {?string}
 */
Series.prototype.type = function($) {
  var text = $('#title h1').text() || '';
  var match = text.match(/[\w]+$/);
  return (match ? match[0].toLowerCase() : text.toLowerCase()) || undefined;
};

module.exports = Series;
