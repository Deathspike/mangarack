'use strict';
var Bluebird = require('bluebird');
var fs = require('fs');

/**
 * File I/O is provided by simple wrappers around standard POSIX functions.
 * @const
 */
module.exports = Bluebird.promisifyAll(fs);

/**
 * Test whether or not the given path exists by checking with the file system.
 * @param {string} path
 * @return {boolean}
 */
module.exports.existsAsync = function (path) {
    return new Bluebird(function (resolve) {
        fs.exists(path, resolve);
    });
};
