/*jslint node: true*/
'use strict';
// Initialize the agent.
var agent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)';
// Initialize the cheerio module.
var cheerio = require('cheerio');
// Initialize the request module.
var request = require('request');

// ==================================================
// Populate the resource.
// --------------------------------------------------
module.exports.populate = function (resource, encoding, done) {
	// Initialize the string state.
	var isString = typeof resource === 'string',
		// Initialize the location.
		location = isString ? resource : resource.location;
	// Check if the encoding is a function.
	if (typeof encoding === 'function') {
		// Set the done callback.
		done = encoding;
		// Remove the encoding.
		encoding = null;
	}
	// Check if the location is invalid.
	if (!location) {
		// Schedule the done callback.
		setTimeout(done, 0, null, resource);
		// Stop the function.
		return;
	}
	// Request the resource ...
	request({
		// ... with the user agent ...
		headers: {'User-Agent': agent},
		// ... with the encoding ...
		encoding: encoding || 'utf8',
		// ... with the location ...
		url: location
	// ... and the success callback.
	}, function (response, body) {
		// Check if the body is a string.
		if (typeof body === 'string') {
			// Initialize the document.
			var $ = cheerio.load(body),
				// Initialize the key.
				key;
			// Iterate through each key.
			for (key in resource) {
				// Check if the property is a function.
				if (typeof resource[key] === 'function') {
					// Invoke the property.
					resource[key] = resource[key]($);
				}
			}
		}
		// Check if the resource is not a string.
		if (!isString) {
			// Remove the location.
			resource.location = null;
		}
		// Invoke the done callback.
		done(null, body);
	}.error(done));
};