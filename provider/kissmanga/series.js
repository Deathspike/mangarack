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
	// Set the location ...
	this.location = /\?confirm=yes$/i.test(location) ?
		// ... with the existing confirmation ...
		location :
		// ... with an appended confirmation.
		location + '?confirm=yes';
}

// ==================================================
// Contains each author.
// --------------------------------------------------
Series.prototype.authors = function ($) {
	// Search for each artist.
	return $('a[href*=\'/AuthorArtist/\']').map(function (i, el) {
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
	$('a[href*=\'/Manga/\'][title*=\'Read\']').map(function (i, el) {
		// Initialize the scan.
		var scan = scanner($(el).text().replace(/\.0+/, '.'));
		// Initialize the location.
		var location = ($(el).attr('href') || '').trim();
		// Initialize the identifier.
		var identifier = location.match(/id=([0-9]+)$/i);
		// Check if the location, scan and identifier are valid.
		if (location && scan && identifier) {
			// Push the chapter ...
			results.push(new Chapter(
				// ... with the identifier ...
				identifier,
				// ... with the location ...
				'http://kissmanga.com/' + location.replace(/^\//, ''),
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
	// Search for each artist.
	return $('a[href*=\'/Genre/\']').map(function (i, el) {
		// Return the text.
		return $(el).text().trim() || undefined;
	}).get();
};

// ==================================================
// Contains the image location.
// --------------------------------------------------
Series.prototype.imageLocation = function ($) {
	// Return the image address.
	return ($('img[src*=\'/Uploads/\']').attr('src') || '').trim();
};

// ==================================================
// Contains the summary.
// --------------------------------------------------
Series.prototype.summary = function ($) {
	// Return the summary.
	return ($('span:contains(Summary:)').parent().next().text() || '').trim();
};

// ==================================================
// Contains the title.
// --------------------------------------------------
Series.prototype.title = function ($) {
	// Initialize the match.
	var match = $('title').text().match(/^(.+)\s+Manga\s+\|/i);
	// Return the title.
	return match && match[1] ? match[1].trim() : undefined;
};

// Check if the module is availabe.
if (typeof module !== 'undefined') {
	// Export the function.
	module.exports = Series;
}