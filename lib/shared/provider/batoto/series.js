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
  this.address = address;
}

/**
 * Retrieves each artist.
 * @param {?} $
 * @return {!Array.<string>}
 */
Series.prototype.artists = function($) {
  return $('td:contains(Artist:)+ > a').map(function(i, el) {
    return $(el).text().trim() || undefined;
  }).get();
};

/**
 * Retrieves each author.
 * @param {?} $
 * @return {!Array.<string>}
 */
Series.prototype.authors = function($) {
  return $('td:contains(Author:)+ > a').map(function(i, el) {
    return $(el).text().trim() || undefined;
  }).get();
};

/**
 * Retrieves each child.
 * @param {?} $
 * @return {!Array.<IChapter>}
 */
Series.prototype.children = function($) {
  var results = [];
  $('tr.lang_English').find('a[href*=\'/read/\']').map(function(i, el) {
    var address = ($(el).attr('href') || '').trim();
    var scan = scanner($(el).text());
    var identifier = address.match(/_\/([0-9]+)\//i);
    if (address && scan && identifier) {
      results.push(new Chapter(
        address,
        identifier,
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
Series.prototype.genres = function($) {
  return $('td:contains(Genres:)+ > a').map(function(i, el) {
    return $(el).text().trim() || undefined;
  }).get();
};

/**
 * Retrieves the image address.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.imageAddress = function($) {
  var address = $('img[src*=\'/uploads/\']').first().attr('src');
  return address ? address.trim() : undefined;
};

/**
 * Retrieves the summary.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.summary = function($) {
  var html = $('td:contains(Description:)').next().html() || '';
  var text = $('<div />').html(html.replace(/<br\s*\/?>/g, '\n')).text();
  return text || undefined;
};

/**
 * Retrieves the title.
 * @param {?} $
 * @return {?string}
 */
Series.prototype.title = function($) {
  return $('h1.ipsType_pagetitle').text().trim() || undefined;
};

module.exports = Series;
