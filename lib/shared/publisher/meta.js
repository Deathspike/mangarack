'use strict';
var xml2js = require('xml2js');

/**
 * Represents meta information.
 * @constructor
 * @param {!ISeries} series
 * @param {!IChapter} chapter
 */
function Meta(series, chapter) {
  this.genre = series.genres.join(', ');
  this.manga = isManga(series) ? 'YesAndRightToLeft' : undefined;
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
 * Loads meta information from xml.
 * @param {string} xml
 * @param {function(Error, Meta)} done
 */
Meta.load = function(xml, done) {
  xml2js.parseString(xml, {
    explicitArray: false,
    explicitRoot: false
  }, function(err, result) {
    if (err) return done(err);
    var meta = lowerCamelCase(result, Object.create(Meta.prototype));
    meta.genre = defaultTo(meta.genre, '');
    meta.number = defaultTo(meta.number);
    meta.penciller = defaultTo(meta.penciller, '');
    meta.series = defaultTo(meta.series);
    meta.summary = defaultTo(meta.summary);
    meta.title = defaultTo(meta.title);
    meta.volume = defaultTo(meta.volume);
    meta.writer = defaultTo(meta.writer, '');
    done(undefined, meta);
  });
};

/**
 * Add a page to the metadata.
 * @param {string} key
 * @param {?number} number
 */
Meta.prototype.add = function(key, number) {
  this.pages.page.push({$: {
    key: key,
    image: isNaN(number) ? 0 : number || 0,
    type: Boolean(number) ? undefined : 'FrontCover'
  }});
};

/**
 * Export meta information to xml.
 * @return {string}
 */
Meta.prototype.xml = function() {
  return new xml2js.Builder({
    rootName: 'ComicInfo',
    xmldec: {version: '1.0', encoding: 'utf-8'}
  }).buildObject(titleCase(this));
};

/**
 * Check if the series can be considered to be manga.
 * @param series
 * @return {boolean}
 */
function isManga(series) {
  return !series.type || series.type === 'manga';
}

/**
 * Defaults a value.
 * @private
 * @param {*} value
 * @param {*=} defaultValue
 * @return {*}
 */
function defaultTo(value, defaultValue) {
  return value || defaultValue;
}

/**
 * Map the source to a duplicate with lower camel case case keys.
 * @private
 * @param {(!Array.<!Object>|!Object)} src
 * @param {!Object=} destination
 * @return {(!Array.<!Object>|!Object)}
 */
function lowerCamelCase(src, destination) {
  var res = destination || (Array.isArray(src) ? [] : {});
  Object.keys(src).forEach(function(x) {
    if (typeof src[x] === 'undefined') return;
    var title = x.charAt(0).toLowerCase() + x.substr(1);
    res[title] = typeof src[x] === 'object' ? lowerCamelCase(src[x]) : src[x];
  });
  return res;
}

/**
 * Map the source to a duplicate with title case keys.
 * @private
 * @param {(!Array.<!Object>|!Object)} src
 * @return {(!Array.<!Object>|!Object)}
 */
function titleCase(src) {
  var res = Array.isArray(src) ? [] : {};
  Object.keys(src).forEach(function(x) {
    if (typeof src[x] === 'undefined') return;
    var title = x.charAt(0).toUpperCase() + x.substr(1);
    res[title] = typeof src[x] === 'object' ? titleCase(src[x]) : src[x];
  });
  return res;
}

module.exports = Meta;
