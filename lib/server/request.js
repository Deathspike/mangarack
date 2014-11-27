'use strict';
var agent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)';
var cheerio = require('cheerio');
var http = require('http');
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
 * Populates the resource from a HTTP resource.
 * @param {!{address: ?string}} resource
 * @param {string} encoding
 * @param {function(Error)} done
 */
function populate(resource, encoding, done) {
  if (!resource.address) return process.nextTick(done);
  request(resource.address, encoding, function(err, data) {
    if (err || !data) return done(err);
    var $ = cheerio.load(data);
    for (var key in resource) {
      if (typeof resource[key] === 'function') {
        resource[key] = resource[key]($);
      }
    }
    resource.address = undefined;
    done();
  });
}

/**
 * Requests a HTTP resource.
 * @param {string} path
 * @param {string} encoding
 * @param {function(Error, ?string)} done
 */
function request(path, encoding, done) {
  var options = url.parse(path);
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
      done(undefined, data || undefined);
    });
  }).on('error', done);
}
