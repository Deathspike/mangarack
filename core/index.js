/*jslint node: true*/
'use strict';
// Initialize the async module.
var async = require('async');
// Initialize the engine module.
var engine = require('../engine');

// ==================================================
// Populate the chapter.
// --------------------------------------------------
module.exports.chapter = function (chapter, done) {
	// Populate the chapter.
	engine.populate(chapter, function () {
		// Iterate over each page.
		async.eachSeries(chapter.children, module.exports.page, done);
	}.error(done));
};

// ==================================================
// Populate the series.
// --------------------------------------------------
module.exports.series = function (series, done) {
	// Populate the series.
	engine.populate(series, function () {
		// Initialize the image location.
		var imageLocation = series.imageLocation;
		// Check if the image location is valid.
		if (imageLocation) {
			// Populate the image.
			engine.populate(imageLocation, 'binary', function (error, image) {
				// Check if no error occurred.
				if (!error) {
					// Set the image.
					series.image = image;
				}
				// Iterate over each chapter.
				async.eachSeries(series.children, module.exports.chapter, done);
			});
		} else {
			// Iterate over each chapter.
			async.eachSeries(series.children, module.exports.chapter, done);
		}
	}.error(done));
};

// ==================================================
// Populate the page.
// --------------------------------------------------
module.exports.page = function (page, done) {
	// Populate the page.
	engine.populate(page, function () {
		// Initialize the image location.
		var imageLocation = page.imageLocation,
			// Initialize the array state.
			isArray = Array.isArray(imageLocation),
			// Initialize the array
			array = isArray ? imageLocation : [imageLocation];
		// Iterate over each image location.
		async.eachSeries(array, function (imageLocation, next) {
			// Check if the image is set.
			if (page.image) {
				// Invoke the next callback.
				next();
				// Stop the function.
				return;
			}
			engine.populate(imageLocation, 'binary', function (error, image) {
				// Check if no error occurred.
				if (!error) {
					// Set the image.
					page.image = image;
				}
				// Invoke the next callback.
				next();
			});
		}, done);
	}.error(done));
};