'use strict';
var Chapter = require('./chapter');
var scanner = require('../scanner');

/**
 * Represents a series.
 * @constructor
 * @implements {ISeries}
 * @param {string} address
 */
function Series(address) {
  this.address = /\?confirm=yes$/i.test(address) ?
    address :
    address + '?confirm=yes';
}

/**
 * Retrieves each artist.
 * @returns {!Array.<string>}
 */
Series.prototype.artists = function() {
  return [];
};

/**
 * Retrieves each author.
 * @param {?} $
 * @returns {!Array.<string>}
 */
Series.prototype.authors = function($) {
  return $('a[href*=\'/AuthorArtist/\']').map(function(i, el) {
    return $(el).text().trim() || undefined;
  }).get();
};

/**
 * Retrieves each child.
 * @param {?} $
 * @returns {!Array.<!IChapter>}
 */
Series.prototype.children = function($) {
  var results = [];
  $('a[href*=\'/Manga/\'][title*=\'Read\']').map(function(i, el) {
    var address = ($(el).attr('href') || '').trim();
    var scan = scanner($(el).text().replace(/\.0+/, '.'));
    var identifier = address.match(/id=([0-9]+)$/i);
    if (address && scan && identifier) {
      results.push(new Chapter(
        'http://kissmanga.com/' + address.replace(/^\//, ''),
        identifier,
        scan.number,
        scan.title || undefined,
        scan.version,
        scan.volume
      ));
    }
  });
  return results.reverse();
};

/**
 * Retrieves each genre.
 * @param {?} $
 * @returns {!Array.<string>}
 */
Series.prototype.genres = function($) {
  return $('a[href*=\'/Genre/\']').map(function(i, el) {
    return $(el).text().trim() || undefined;
  }).get();
};

/**
 * Retrieves the image address.
 * @param {?} $
 * @returns {?string}
 */
Series.prototype.imageAddress = function($) {
  return ($('img[src*=\'/Uploads/\']').attr('src') || '').trim() || undefined;
};

/**
 * Retrieves the summary.
 * @param {?} $
 * @returns {?string}
 */
Series.prototype.summary = function($) {
  var text = $('span:contains(Summary:)').parent().next().text();
  return text ? text.trim() : undefined;
};

/**
 * Retrieves the title.
 * @param {?} $
 * @returns {?string}
 */
Series.prototype.title = function($) {
  var match = $('title').text().match(/^(.+)\s+Manga\s+\|/im);
  return match && match[1] ? match[1].trim() : undefined;
};

/**
 * Retrieves the type.
 * @returns {?string}
 */
Series.prototype.type = function() {
  return undefined;
};

module.exports = Series;
