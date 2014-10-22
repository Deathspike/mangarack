// Enable restricted mode.
'use strict';
// Initialize the agent.
var agent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)';
// Initialize the cheerio module.
var cheerio = require('cheerio');
var http = require('http');
var url = require('url');
var zlib = require('zlib');

// ==================================================
// Export the request function.
// --------------------------------------------------
module.exports.request = function *(url, encoding) {
    var response = yield request(url, encoding || 'utf8');
    return response;
};

// ==================================================
// Export the populate function.
// --------------------------------------------------
module.exports.populate = function *(resource) {
    // Check if the address is valid.
    if (resource.address) {
        // Initialize the document.
        var $ = cheerio.load((yield this.request(resource.address)) || '');
        // Iterate through each key.
        for (var key in resource) {
            // Check if the property is a function.
            if (typeof resource[key] === 'function') {
                // Invoke the property.
                resource[key] = resource[key]($);
            }
        }
        // Delete the address.
        delete resource.address;
    }
};

/**
 * Request data from the server.
 * @param {string} path
 * @param {string=} encoding
 * @return {function(function(?string, *))}
 */
function request(path, encoding) {
    return function (fn) {
        if (typeof encoding === 'function') {
            fn = encoding;
            encoding = 'utf8';
        }
        var obj = url.parse(path);
        obj.headers = {'User-Agent': agent};
        http.get(obj, function (res) {
            var data = '';

            if (res.headers['content-encoding'] === 'gzip') {
                res.pipe(zlib.createGunzip());
            } else if (res.headers['content-encoding'] === 'deflate') {
                res.pipe(zlib.createInflate());
            }

            res.setEncoding(encoding || 'utf8');
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                fn(undefined, data);
            });
        }).on('error', function (err) {
            fn(err);
        });
    };
}
