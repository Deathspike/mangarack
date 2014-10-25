'use strict';
var archiver = require('archiver');
var fs = require('fs');
var path = require('path');
var url = require('url');

/**
 * Represents a writer.
 * @class
 * @param {string} path
 */
function Writer(path) {
    this._archive = archiver.create('zip', {store: true});
    this._archive.pipe(fs.createWriteStream(path));
}

/**
 * Add the image.
 * @param {string} address
 * @param {number} number
 * @param {!Object} image
 */
Writer.prototype.add = function (address, number, image) {
    var buffer = new Buffer(image, 'binary');
    var name = number.toString();
    var extension = path.extname(url.parse(address).pathname);
    while (name.length < 3) {
        name = 0 + name;
    }
    this._archive.append(buffer, {name: name + extension});
};

/**
 * Publish the archive.
 */
Writer.prototype.publish = function () {
    this._archive.finalize();
};

if (typeof module !== 'undefined') {
    module.exports = Writer;
}
