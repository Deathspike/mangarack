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
	this.location = location;
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
	// Initialize the match.
	var match;
	// Initialize the regular expression.
	var regex = /lstImages\.push\("(.+?)"\)/gi;
	// Initialize each result.
	var results = [];
	// Initialize the text.
	var text = $('script:contains(lstImages)').text();
	// Iterate through the text.
	while ((match = regex.exec(text)) !== null) {
		// Push the image to the results.
		results.push(new Page(match[1]));
	}
	// Return each result.
	return results;
};

// Check if the module is availabe.
if (typeof module !== 'undefined') {
	// Export the function.
	module.exports = Chapter;
}