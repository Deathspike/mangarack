'use strict';
var agent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)';
var Bluebird = require('bluebird');
var cheerio = require('cheerio');
var http = require('http');
var url = require('url');
var zlib = require('zlib');

/**
 * Requests or populate the resource from a HTTP resource.
 * @param {string|!{address: string}} resource
 * @param {string=} encoding
 * @return {?string|!{address: ?string}}
 */
module.exports = function *(resource, encoding) {
    return typeof resource === 'string' ?
        yield request(resource, encoding) :
        yield populate(resource, encoding);
};

/**
 * Populates the resource from a HTTP resource.
 * @param {!{address: ?string}} resource
 * @param {string=} encoding
 * @return !{address: ?string}
 */
function *populate(resource, encoding) {
    if (resource.address) {
        var contents = yield request(resource.address, encoding);
        if (contents) {
            var $ = cheerio.load(contents);
            for (var key in resource) {
                if (typeof resource[key] === 'function') {
                    resource[key] = resource[key]($);
                }
            }
            resource.address = undefined;
        }
    }
    return resource;
}

/**
 * Requests a HTTP resource.
 * @param {string} path
 * @param {string=} encoding
 * @return {function(function(?string, ?string))}
 */
function request(path, encoding) {
    return new Bluebird(function (resolve, reject) {
        var options = url.parse(path);
        options.headers = {'User-Agent': agent};
        http.get(options, function (res) {
            var data = '';
            res.setEncoding(encoding || 'utf8');
            if (res.headers['content-encoding'] === 'gzip') {
                res.pipe(zlib.createGunzip());
            } else if (res.headers['content-encoding'] === 'deflate') {
                res.pipe(zlib.createInflate());
            }
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                resolve(data || undefined);
            });
        }).on('error', reject);
    });
}
