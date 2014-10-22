'use strict';

// ==================================================
// Export the function.
// --------------------------------------------------
module.exports = function *(engine, publisher, series, chapter) {
    yield engine.populate(series);
    yield previewImage(engine, publisher, series);
    yield engine.populate(chapter);
    for (var i = 0; i < chapter.children.length; i += 1) {
        var page = chapter.children[i];
        yield engine.populate(page);
        yield processPage(engine, publisher, page, i + 1);
    }
};

/**
 * Process the preview image.
 * @param {?} engine
 */
function *previewImage(engine, publisher, series) {
    if (!series.image && series.imageAddress) {
        series.image = yield engine.request(series.imageAddress, 'binary');
    }
    if (series.image) {
        yield publisher.publish(0, series.imageAddress, series.image);
    }
}

/**
 * Process the page
 */
function *processPage(engine, publisher, page, number) {
    var imageAddresses = [].concat(page.imageAddress);
    for (var i = 0; i < imageAddresses.length; i += 1) {
        var imageAddress = imageAddresses[i];
        var image = yield engine.request(imageAddress, 'binary');
        if (image) {
            yield publisher.publish(number, imageAddress, image);
            return;
        }
    }
    yield publisher.publish(number);
}
