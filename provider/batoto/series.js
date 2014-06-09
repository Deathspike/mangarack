// Enable restricted mode.
'use strict';
// Initialize the chapter module.
var Chapter = require('./chapter');
// Initialize the scanner module.
var scanner = require('../scanner');

// ==================================================
// Represents the series.
// --------------------------------------------------
function Series(location) {
	// Set the location.
	this.location = location;
}

// ==================================================
// Contains each artist.
// --------------------------------------------------
Series.prototype.artists = function ($) {
	// Search for each artist.
	return $('td:contains(Artist:)').next().find('a').map(function (i, el) {
		// Return the text.
		return $(el).text().trim() || undefined;
	}).get();
};

// ==================================================
// Contains each author.
// --------------------------------------------------
Series.prototype.authors = function ($) {
	// Search for each artist.
	return $('td:contains(Author:)').next().find('a').map(function (i, el) {
		// Return the text.
		return $(el).text().trim() || undefined;
	}).get();
};

// ==================================================
// Contains each child.
// --------------------------------------------------
Series.prototype.children = function ($) {
	// Initialize each result.
	var results = [];
	// Search for each chapter.
	$('tr.lang_English').find('a[href*=\'/read/\']').map(function (i, el) {
		// Initialize the scan.
		var scan = scanner($(el).text());
		// Initialize the location.
		var location = ($(el).attr('href') || '').trim();
		// Initialize the identifier.
		var identifier = location.match(/_\/([0-9]+)\//i);
		// Check if the location, scan and unique identifier are valid.
		if (location && scan && identifier) {
			// Push the chapter ...
			results.push(new Chapter(
				// ... with the identifier ...
				identifier,
				// ... with the location ...
				location,
				// ... with the number ...
				scan.number,
				// ... with the title ...
				scan.title,
				// ... with the volume.
				scan.volume
			));
		}
	});
	// Return each result in reverse.
	return results.reverse();
};

// ==================================================
// Contains each genre.
// --------------------------------------------------
Series.prototype.genres = function ($) {
	// Search for each genre.
	return $('td:contains(Genres:)').next().find('a').map(function (i, el) {
		// Return the text.
		return $(el).text().trim() || undefined;
	}).get();
};

// ==================================================
// Contains the image location.
// --------------------------------------------------
Series.prototype.imageLocation = function ($) {
	// Return the image address.
	return ($('img[src*=\'/uploads/\']').first().attr('src') || '').trim();
};

// ==================================================
// Contains the summary.
// --------------------------------------------------
Series.prototype.summary = function ($) {
	// Initialize the summary.
	var html = $('td:contains(Description:)').next().html() || '';
	// Return the summary.
	return $("<div />").html(html.replace(/<br\s*\/?>/g, '\n')).text();
};

// ==================================================
// Contains the title.
// --------------------------------------------------
Series.prototype.title = function ($) {
	// Return the title.
	return $('h1.ipsType_pagetitle').text().trim() || undefined;
};

// Check if the module is availabe.
if (typeof module !== 'undefined') {
	// Export the function.
	module.exports = Series;
}