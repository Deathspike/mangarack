'use strict';
var request = require('./request');
var Writer = require('./writer');

/**
 * Mirror the chapter.
 * @param {!Object} options
 * @param {!Series} series
 * @param {!Chapter} chapter
 */
module.exports = function *(options, series, chapter) {
    var writer = new Writer('tmp/test.zip');
    yield publish(writer, series, chapter);
    writer.publish();
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
