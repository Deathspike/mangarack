// Enable restricted mode.
'use strict';
// Initialize the page function.
var processPage;
// Initialize the preview image function.
var processPreviewImage;

// ==================================================
// Export the function.
// --------------------------------------------------
module.exports = function* (engine, publish, series, chapter) {
	// Populate the series.
	yield engine.populate(series);
	// Process the preview image.
	yield processPreviewImage(engine, publish, series);
	// Populate the chapter.
	yield engine.populate(chapter);
	// Iterate through each page.
	for (var i = 0; i < chapter.children.length; i += 1) {
		// Initialize the page.
		var page = chapter.children[i];
		// Populate the page.
		yield engine.populate(page);
		// Process the page.
		yield processPage(engine, publish, page, i + 1);
	}
};

// ==================================================
// Process the preview image.
// --------------------------------------------------
processPreviewImage = function* (engine, publish, series) {
	// Check if the image should be requested.
	if (!series.image && series.imageLocation) {
		// Request the image.
		series.image = yield engine.request(series.imageLocation, 'binary');
	}
	// Check if the series has a valid image.
	if (series.image) {
		// Publish the image.
		yield publish(0, series.imageLocation, series.image);
	}
};

// ==================================================
// Process the preview image.
// --------------------------------------------------
processPage = function *(engine, publish, page, number) {
	// Initialize each image location.
	var imageLocations = [].concat(page.imageLocation);
	// Iterate through each image location.
	for (var i = 0; i < imageLocations.length; i += 1) {
		// Initialize the image location.
		var imageLocation = imageLocations[i];
		// Initialize the image.
		var image = yield engine.request(imageLocation, 'binary');
		// Check if the image is valid.
		if (image) {
			// Publish the image.
			yield publish(number, imageLocation, image);
			// Stop the function.
			return;
		}
	}
	// Publish the invalid image.
	yield publish(number);
};