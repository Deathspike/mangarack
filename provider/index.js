/*jslint node: true*/
'use strict';
// Initialize the alter module.
var alter = require('./alter');
// Initialize the batoto module.
var batoto = require('./batoto');
// Initialize the kissmanga module.
var kissmanga = require('./kissmanga');
// Initialize the mangafox module.
var mangafox = require('./mangafox');

// ==================================================
// Export the function.
// --------------------------------------------------
module.exports = function (location) {
	// Initialize the populate function.
	var populate,
		// Initialize the series.
		series = batoto(location) || kissmanga(location) || mangafox(location);
	// Check if the series is valid.
	if (series) {
		// Initialize the populate function.
		populate = series.children;
		// Initialize the children alterant.
		series.children = function ($) {
			// Initialize each child.
			var children = populate($);
			// Alter each child containing an undefined number.
			alter(children);
			// Return each child.
			return children;
		};
	}
	// Return the series.
	return series;
};