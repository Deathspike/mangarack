// Enable restricted mode.
'use strict';
// Initialize the agent.
var agent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)';
// Initialize the cheerio module.
var cheerio = require('cheerio');
// Initialize the request module.
var request = require('request');
// Initialize the thunkify module.
var thunkify = require('thunkify');

// ==================================================
// Export the request function.
// --------------------------------------------------
module.exports.request = function* (url, encoding) {
	// Request the resource ...
	var result = yield thunkify(request)({
		// ... with the user agent ...
		headers: {'User-Agent': agent},
		// ... with the encoding ...
		encoding: encoding || 'utf8',
		// ... with the location ...
		url: url
	});
	// Return the result.
	return result[0].statusCode === 200 ? result[1] : undefined;
};

// ==================================================
// Export the populate function.
// --------------------------------------------------
module.exports.populate = function* (resource) {
	// Check if the location is valid.
	if (resource.location) {
		// Initialize the document.
		var $ = cheerio.load(yield this.request(resource.location));
		// Iterate through each key.
		for (var key in resource) {
			// Check if the property is a function.
			if (typeof resource[key] === 'function') {
				// Invoke the property.
				resource[key] = resource[key]($);
			}
		}
		// Delete the location.
		delete resource.location;
	}
};