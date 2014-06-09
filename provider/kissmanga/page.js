// Enable restricted mode.
'use strict';

// ==================================================
// Represents the page.
// --------------------------------------------------
function Page(imageLocation) {
	// Set the image location.
	this.imageLocation = imageLocation;
}

// Check if the module is availabe.
if (typeof module !== 'undefined') {
	// Export the function.
	module.exports = Page;
}