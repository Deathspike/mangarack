/*jslint node: true*/
'use strict';
// Initialize the cheerio module.
var cheerio = require('cheerio');
// Initialize the request module.
var request = require('request');

function populate(item, callback) {
	// Check if the source does not have a location.
	if (!item.location) {
		if (callback) {
			// Schedule the callback.
			setTimeout(callback, 0, null, item);
		}
		// Stop the function.
		return;
	}
	// Request the location.
	request({
		headers: {
			'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)'
		},
		url: item.location
	}, function (response, document) {
		// Initialize the document.
		var $ = cheerio.load(document),
			// Initialize the key.
			key;
		// Iterate through each key.
		for (key in item) {
			// Check if the item is a function.
			if (typeof item[key] === 'function') {
				// Invoke the function.
				item[key] = item[key]($);
			}
		}
		if (callback) {
			// Invoke the callback.
			callback(null, item);
		}
	}.error(callback));
}

Function.prototype.error = function (fn) {
	return function (err) {
		if (err) {
			fn.apply(this, arguments);
			return;
		}
		this.apply(this, Array.prototype.slice.call(arguments, 1));
	}.bind(this);
};

var provider = require('./provider');
var series = provider('http://www.batoto.net/comic/_/comics/mahou-shoujo-lyrical-nanoha-vivid-r887');

populate(series, function (error, series) {
	console.log(series);
	populate(series.children[0], function (error, chapter) {
		console.log(chapter);
	//	populate(chapter.children[0], function (err, page) {
	//		console.log(page);
	//	});
	});
});