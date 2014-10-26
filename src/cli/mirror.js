'use strict';
var fs = require('co-fs');
var path = require('path');
var utilities = require('./utilities');
var Writer = require('./writer');

/**
 * Mirror the chapter.
 * @param {!Series} series
 * @param {!Chapter} chapter Requires to be populated.
 * @param {string=} extension
 * @return {boolean}
 */
module.exports = function *(series, chapter, extension) {
    var pathToBook = utilities.createPathToBook(series, chapter, extension);
    if (pathToBook) {
        var tempPathToBook = pathToBook + '.mrdownload';
        yield ensure(tempPathToBook);
        yield publish(new Writer(tempPathToBook), series, chapter);
        yield fs.rename(tempPathToBook, pathToBook);
        return true;
    }
    return false;
};

/**
 * Ensures the directory to contain the book exists.
 * @param {string} pathToBook
 */
function *ensure(pathToBook) {
    var pathToDirectory = path.dirname(pathToBook);
    if (!(yield fs.exists(pathToDirectory))) {
        yield fs.mkdir(pathToDirectory);
    }
}

/**
 * Publish the chapter.
 * @param {!Writer} writer
 * @param {!Series} series
 * @param {!Chapter} chapter
 */
function *publish(writer, series, chapter) {
    yield publishPreviewImage(writer, series);
    for (var i = 0; i < chapter.children.length; i += 1) {
        var page = chapter.children[i];
        yield utilities.request(page);
        yield publishPage(writer, page, i + 1);
    }
    writer.publish();
}

/**
 * Publish the preview image.
 * @param {!Writer} writer
 * @param {!Series} series
 */
function *publishPreviewImage(writer, series) {
    if (series.imageAddress) {
        var imageAddresses = [].concat(series.imageAddress);
        for (var i = 0; i < imageAddresses.length; i += 1) {
            var imageAddress = imageAddresses[i];
            var image = yield utilities.request(imageAddress, 'binary');
            if (image) {
                writer.add(series.imageAddress, 0, image);
            }
        }
    }
}

/**
 * Publish the page
 * @param {!Writer} writer
 * @param {!Page} page
 * @param {number} number
 */
function *publishPage(writer, page, number) {
    var imageAddresses = [].concat(page.imageAddress);
    for (var i = 0; i < imageAddresses.length; i += 1) {
        var imageAddress = imageAddresses[i];
        var image = yield utilities.request(imageAddress, 'binary');
        if (image) {
            writer.add(imageAddress, number, image);
            return;
        }
    }
}
