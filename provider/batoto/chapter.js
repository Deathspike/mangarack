// Enable restricted mode.
'use strict';
// Initialize the page module.
var Page = require('./page');

// ==================================================
// Represents the chapter.
// --------------------------------------------------
function Chapter(identifier, location, number, title, volume) {
	// Set the identifier.
	this.identifier = identifier ? parseInt(identifier[1], 10) : undefined;
	// Set the location.
	this.location = location + '?supress_webtoon=t';
	// Set the number.
	this.number = number;
	// Set the title.
	this.title = title || undefined;
	// Set the volume.
	this.volume = volume;
}

// ==================================================
// Contains each child.
// --------------------------------------------------
Chapter.prototype.children = function ($) {
	// Initialize the select.
	var select = $('select[name=page_select]').first();
	// Find each page option.
	return select.find('option[value*=\'/read/\']').map(function (i, el) {
		// Initialize the value.
		var value = $(el).attr('value');
		// Initialize the page.
		var page = value ? new Page(value) : undefined;
		// Check if this is the first page and is valid.
		if (i === 0 && page) {
			// Update the image location.
			page.imageLocation = page.imageLocation($);
			// Remove the location.
			page.location = null;
		}
		// Return the page, or undefined.
		return page;
	}).get();
};

// Check if the module is availabe.
if (typeof module !== 'undefined') {
	// Export the function.
	module.exports = Chapter;
}