// Enable restricted mode.
'use strict';

// ==================================================
// Represents the page.
// --------------------------------------------------
function Page(location) {
    // Set the location.
    this.location = location + '?supress_webtoon=t';
}

// ==================================================
// Contains the image location.
// --------------------------------------------------
Page.prototype.imageLocation = function ($) {
    // Return the image.
    return $('img[alt*=\'Batoto!\']').attr('src') || undefined;
};

// Check if the module is availabe.
if (typeof module !== 'undefined') {
    // Export the function.
    module.exports = Page;
}
