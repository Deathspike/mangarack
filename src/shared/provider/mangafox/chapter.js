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
    // Initialize the location ...
    var location = /[0-9]+\.html$/i.test(this.location) ?
        // ... with the current location ...
        this.location :
        // ... or the location with a suffix.
        this.location + '1.html';
    // Find each page option.
    return $('select.m').first().find('option').filter(function (i, el) {
        // Filter each invalid page.
        return parseInt($(el).text(), 10) > 0;
    }).map(function (i, el) {
        // Initialize the next number.
        var nextNumber = $(el).text() + '.html';
        // Initialize the page.
        var page = new Page(location.replace(/[0-9]+\.html$/i, nextNumber));
        // Check if this is the first page.
        if (i === 0) {
            // Update the image location.
            page.imageLocation = page.imageLocation($);
            // Remove the location.
            page.location = null;
        }
        // Return the page.
        return page;
    }).get();
};

// Check if the module is availabe.
if (typeof module !== 'undefined') {
    // Export the function.
    module.exports = Chapter;
}
