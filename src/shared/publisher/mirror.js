'use strict';

/**
 * Mirrors the chapter.
 * @param {!Agent} agent
 * @param {!Series} series The populated series.
 * @param {!Chapter} chapter The populated chapter.
 */
module.exports = function *(agent, series, chapter) {
    yield publishPreviewImage(agent, series);
    for (var i = 0; i < chapter.children.length; i += 1) {
        var page = chapter.children[i];
        yield agent.populate(page);
        yield publishPage(agent, page, i + 1);
    }
};

/**
 * Publishes the preview image.
 * @param {!Agent} agent
 * @param {!Series} series
 */
function *publishPreviewImage(agent, series) {
    if (series.imageAddress) {
        var imageAddresses = [].concat(series.imageAddress);
        for (var i = 0; i < imageAddresses.length; i += 1) {
            if (yield agent.add(imageAddresses[i])) {
                return;
            }
        }
    }
}

/**
 * Publishes the page
 * @param {!Agent} agent
 * @param {!Page} page
 * @param {number} number
 */
function *publishPage(agent, page, number) {
    var imageAddresses = [].concat(page.imageAddress);
    for (var i = 0; i < imageAddresses.length; i += 1) {
        if (yield agent.add(imageAddresses[i], number)) {
            return;
        }
    }
}
