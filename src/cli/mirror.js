'use strict';
var fs = require('co-fs');
var path = require('./path');
var request = require('./request');
var Writer = require('./writer');

/**
 * Mirror the chapter.
 * @param {!Object} options
 * @param {!Series} series
 * @param {!Chapter} chapter
 */
module.exports = function *(options, series, chapter) {
    var file = yield path(series, chapter, options.extension);
    if (file && (options.duplication || !(yield fs.exists(file)))) {
        console.log('Fetching ' + file);
        var writer = new Writer(file);
        yield request(series);
        yield request(chapter);
        yield publish(writer, series, chapter);
        writer.publish();
        console.log('Finished ' + file);
    }
};

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
        yield request(page);
        yield publishPage(writer, page, i + 1);
    }
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
            var image = yield request(imageAddress, 'binary');
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
        var image = yield request(imageAddress, 'binary');
        if (image) {
            writer.add(imageAddress, number, image);
            return;
        }
    }
}
