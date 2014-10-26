'use strict';
var archiver = require('archiver');
var fs = require('fs');
var path = require('path');
var url = require('url');

/**
 * Represents a writer.
 * @class
 * @param {string} pathToBook
 */
function Writer(pathToBook) {
    this._archive = archiver.create('zip', {store: true});
    this._archive.pipe(fs.createWriteStream(pathToBook));
}

/**
 * Add the image.
 * @param {string} address
 * @param {number} number
 * @param {string} image
 */
Writer.prototype.add = function (address, number, image) {
    var name = number.toString();
    var extension = path.extname(url.parse(address).pathname);
    while (name.length < 3) {
        name = 0 + name;
    }
    this._archive.append(new Buffer(image, 'binary'), {name: name + extension});
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
