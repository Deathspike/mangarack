// Enable restricted mode.
'use strict';

// ==================================================
// Represents the page.
// --------------------------------------------------
function Page(location) {
    // Set the location.
    this.location = location;
}

// ==================================================
// Contains the image location.
// --------------------------------------------------
Page.prototype.imageLocation = function ($) {
    // Initialize the image.
    var image = $('meta[property=\'og:image\']').attr('content');
    // Check if the image is valid.
    if (image) {
        // Replace the thumbnail with full size .
        image = image.replace('thumbnails/mini.', 'compressed/');
        // Return each available image.
        return [image, image.replace('http://l.', 'http://z.')];
    }
    // Return undefined.
    return undefined;
};

// Check if the module is availabe.
if (typeof module !== 'undefined') {
    // Export the function.
    module.exports = Page;
}
