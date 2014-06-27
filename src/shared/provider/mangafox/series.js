// Enable restricted mode.
'use strict';
// Initialize the chapter module.
var Chapter = require('./chapter');

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
    return $('a[href*=\'/search/artist/\']').map(function (i, el) {
        // Return the text.
        return $(el).text().trim() || undefined;
    }).get();
};

// ==================================================
// Contains each author.
// --------------------------------------------------
Series.prototype.authors = function ($) {
    // Search for each artist.
    return $('a[href*=\'/search/author/\']').map(function (i, el) {
        // Return the text.
        return $(el).text().trim() || undefined;
    }).get();
};

// ==================================================
// Contains each child.
// --------------------------------------------------
Series.prototype.children = function ($) {
    // Initialize the regular expression.
    var regex = /id=([0-9]+)/i;
    // Initialize each result.
    var results = [];
    // Search for each volume.
    $('h3.volume').each(function (i, el) {
        // Initialize the match.
        var match = $(el).text().match(/^Volume\s(.+)$/i);
        // Check if the match is invalid.
        if (match) {
            // Initialize the parent.
            var parent = $(el).parent();
            // Find each chapter block ...
            parent.next().find('a[href*=\'/manga/\']').each(function (i, el) {
                // Push the chapter ...
                results.push(new Chapter(
                    // ... with the identifier ...
                    (parent.prev('a.edit').attr('href') || '').match(regex),
                    // ... with the location ...
                    ($(el).attr('href') || '').trim(),
                    // ... with the number ...
                    parseFloat($(el).text().match(/[0-9\.]+$/)),
                    // ... with the title ...
                    $(el).next('span.title').text().trim(),
                    // ... with the volume.
                    parseFloat(match[1])
                ));
            });
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
    return $('a[href*=\'/search/genres/\']').map(function (i, el) {
        // Return the text.
        return $(el).text().trim() || undefined;
    }).get();
};

// ==================================================
// Contains the image location.
// --------------------------------------------------
Series.prototype.imageLocation = function ($) {
    // Return the image address.
    return ($('img[src*=\'cover.jpg\']').attr('src') || '').trim();
};

// ==================================================
// Contains the summary.
// --------------------------------------------------
Series.prototype.summary = function ($) {
    // Initialize the complete state.
    var isComplete;
    // Initialize the result.
    var result = '';
    // Split the text.
    $('p.summary').text().split('\n').filter(function (piece) {
        // Filter pieces ending with a colon ...
        return !/:$/i.test(piece) &&
            // ... or a from piece ...
            !/^From\s+(.+)$/i.test(piece) &&
            // ... or a source piece.
            !/^\(Source:\s+(.+)\)/i.test(piece);
    }).forEach(function (piece) {
        // Check if the text is blank after valid pieces.
        if (isComplete || (!piece.trim() && result)) {
            // Set the complete state.
            isComplete = true;
            // Return false.
            return false;
        } else {
            // Add the piece to the result.
            result += piece.trim();
            // Return true.
            return true;
        }
    });
    // Return the result.
    return result;
};

// ==================================================
// Contains the title.
// --------------------------------------------------
Series.prototype.title = function ($) {
    // Initialize the match.
    var match = $('title').text().match(/^(.+)\s+Manga\s+-/i);
    // Return the title.
    return match ? match[1].trim() : undefined;
};

// Check if the module is availabe.
if (typeof module !== 'undefined') {
    // Export the function.
    module.exports = Series;
}
