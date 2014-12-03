'use strict';
var agent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)';
var cheerio = require('cheerio');
var http = require('http');
var maximumAttempts = 5;
var url = require('url');
var zlib = require('zlib');

/**
 * Requests or populate the resource from a HTTP resource.
 * @param {(string|!{address: string})} resource
 * @param {string} encoding
 * @param {function(Error, ?string)} done
 */
module.exports = function(resource, encoding, done) {
  if (typeof resource === 'string') return request(resource, encoding, done);
  populate(resource, encoding, done);
};

/**
 * Retrieves the keys containing a function.
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
 * @param {!{address: ?string}} resource
 * @param {string} encoding
 * @param {function(Error)} done
 */
function populate(resource, encoding, done) {
  if (!resource.address) return process.nextTick(done);
  request(resource.address, encoding, function(err, data) {
    if (err) return done(err);
    var $ = cheerio.load(data);
    functions(resource).forEach(function(key) {
      resource[key] = resource[key]($);
    });
    resource.address = undefined;
    done();
  });
}

/**
 * Requests a HTTP resource.
 * @param {string} address
 * @param {string} encoding
 * @param {function(Error, ?string)} done
 * @param {number=} n
 */
function request(address, encoding, done, n) {
  var options = url.parse(address);
  options.headers = {'User-Agent': agent};
  http.get(options, function(res) {
    var data = '';
    var resEncoding = res.headers['content-encoding'];
    res.setEncoding(encoding || 'utf8');
    if (resEncoding === 'gzip') {
      res.pipe(zlib.createGunzip());
    } else if (resEncoding === 'deflate') {
      res.pipe(zlib.createInflate());
    }
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      if (!data) return done(new Error('No data: ' + address));
      done(undefined, data);
    });
  }).on('error', function(err) {
    if (!n) n = 1;
    if (n < maximumAttempts) return request(address, encoding, done, n + 1);
    done(err);
  });
}
