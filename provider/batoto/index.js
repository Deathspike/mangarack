// Enable restricted mode.
'use strict';
// Initialize the regular expression.
var regex = /^http:\/\/www\.batoto\.net\/comic\/_\/comics\/([\w\W]*)-r([0-9]+)/i;
// Initialize the series module.
var Series = require('./series');

// ==================================================
// Export the function.
// --------------------------------------------------
module.exports = function (location) {
	// Determine if the location is valid and return the series, or undefined.
	return regex.test(location) ? new Series(location) : undefined;
};