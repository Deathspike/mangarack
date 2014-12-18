'use strict';
var agent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)';
var cheerio = require('cheerio');
var http = require('http');
var maximum = 5;
var timeout = 10000;
var url = require('url');
var zlib = require('zlib');

/**
 * Requests or populate the resource from a HTTP resource.
 * @param {(string|!{address: string})} resource
 * @param {string} encoding
 * @param {function(Error, string=)} done
 */
module.exports = function(resource, encoding, done) {
  if (typeof resource === 'string') return request(resource, encoding, done);
  populate(resource, encoding, done);
};

/**
 * Creates a callback for a decoded request.
 * @param {string} address
 * @param {string} encoding
 * @param {function(Error, string=)}done
 */
function createRequestCallback(address, encoding, done) {
  return function(err, buffer) {
    if (err) return done(err);
    var data = buffer.toString(encoding || 'utf8');
    if (!data) return done(new Error('No data: ' + address));
    done(err, data);
  };
}

/**
 * Retrieves the keys containing a function.
 * @private
 * @param {!Object} object
 * @return {!Array.<string>}
 */
function functions(object) {
  var map = [];
  for (var key in object) if (typeof object[key] === 'function') map.push(key);
  return map;
}

/**
 * Populates the resource from a HTTP resource.
 * @private
 * @param {!{address: ?string}} resource
 * @param {string} encoding
 * @param {function(Error)} done
 */
function populate(resource, encoding, done) {
  if (!resource.address) return done(undefined);
  request(resource.address, encoding, function(err, data) {
    if (err) return done(err);
    var $ = cheerio.load(data);
    functions(resource).forEach(function(key) {
      resource[key] = resource[key]($);
    });
    resource.address = undefined;
    done(undefined);
  });
}

/**
 * Requests a HTTP resource.
 * @private
 * @param {string} address
 * @param {string} encoding
 * @param {function(Error, string=)} done
 * @param {number=} n
 */
function request(address, encoding, done, n) {
  var options = url.parse(address);
  options.headers = {'User-Agent': agent};
  http.get(options, function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });
    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var compression = res.headers['content-encoding'];
      var callback = createRequestCallback(address, encoding, done);
      if (compression === 'gzip') {
        return zlib.gunzip(buffer, callback);
      } else if (compression === 'deflate') {
        return zlib.inflateRaw(buffer, callback);
      } else {
        callback(undefined, buffer);
      }
    });
  }).on('error', function(err) {
    if (n >= maximum) return done(err);
    setTimeout(function() {
      request(address, encoding, done, n + 1 || 1);
    }, timeout);
  });
}
