'use strict';

// ==================================================
// Export the function.
// --------------------------------------------------
module.exports = function* (engine, publisher, series, chapter) {
    yield engine.populate(series);
    yield previewImage(engine, publisher, series);
    yield engine.populate(chapter);
    for (var i = 0; i < chapter.children.length; i += 1) {
        var page = chapter.children[i];
        yield engine.populate(page);
        yield processPage(engine, publisher, page, i + 1);
    }
};

// ==================================================
// Process the preview image.
// --------------------------------------------------
function* previewImage(engine, publisher, series) {
    if (!series.image && series.imageLocation) {
        series.image = yield engine.request(series.imageLocation, 'binary');
    }
    if (series.image) {
        yield publisher.publish(0, series.imageLocation, series.image);
    }
}

/**
 * Process the page
 */
function* processPage(engine, publisher, page, number) {
    var imageLocations = [].concat(page.imageLocation);
    for (var i = 0; i < imageLocations.length; i += 1) {
        var imageLocation = imageLocations[i];
        var image = yield engine.request(imageLocation, 'binary');
        if (image) {
            yield publisher.publish(number, imageLocation, image);
            return;
        }
    }
    yield publisher.publish(number);
}
