// Enable restricted mode.
'use strict';
// Initialize the archiver module.
var archiver = require('archiver');
// Initialize the fs module.
var fs = require('fs');
// Initialize the path module.
var path = require('path');
// Initialize the url module.
var url = require('url');

// ==================================================
// Represents the publisher.
// --------------------------------------------------
function Publisher(filePath) {
	// Initialize the archive.
	this.archive = archiver.create('zip' , {store: true});
	// Initialize the stream to pipe to.
	this.archive.pipe(fs.createWriteStream(filePath));
}

// ==================================================
// Finalize the publisher.
// --------------------------------------------------
Publisher.prototype.finalize = function* () {
	// Finalize the publisher
	this.archive.finalize();
};

// ==================================================
// Publish the image.
// --------------------------------------------------
Publisher.prototype.publish = function* (number, imageLocation, image) {
	// Initialize the parsed image location.
	var parsedImageLocation = url.parse(imageLocation);
	// Initialize the extension.
	var extension = path.extname(parsedImageLocation.pathname);
	// Check if the image is valid.
	if (image) {
		// Initialize the buffer.
		var buffer = new Buffer(image, 'binary');
		// Initialize the file name.
		var fileName = number.toString();
		// Iterate while the file name length is invalid.
		while (fileName.length < 3) {
			// Pad the file name with a leading zero.
			fileName = 0 + fileName;
		}
		// Append the image.
		this.archive.append(buffer, {name: fileName + extension});
	}
};

// Check if the module is availabe.
if (typeof module !== 'undefined') {
	// Export the function.
	module.exports = Publisher;
}