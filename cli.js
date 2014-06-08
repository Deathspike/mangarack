/*jslint node: true*/
'use strict';
// Initialize the core module.
var core = require('./core');
// Initialize the commander module.
var commander = require('commander');
// Initialize the provider module.
var provider = require('./provider');

commander.version('3.0.0')
	// disables
	.option('-a, --animation', 'Disable animation framing')
	.option('-d, --duplication', 'Disable duplication prevention')
	.option('-f, --footer', 'Disable footer incision')
	.option('-g, --grayscale', 'Disable grayscale size comparison and save.')
	.option('-i, --image', 'Disable image processing.')
	.option('-m, --meta', 'Disable embedded meta-information.')
	.option('-p, --persistent', 'Enable persistent synchronization')
	.option('-r, --repair', 'Disable repair and error tracking.')
	// with option
	.option('-e, --extension <s>', 'The file extension for each file. (Default: cbz)')
	.option('-c, --chapter <n>', 'The chapter filter.')
	.option('-v, --volume <n>', 'The volume filter.')
	.option('-w --worker <n>', 'The maximum parallel workers. (Default: # cores)')
	.option('-s, --source <s>', 'The batch-mode source file. (Default: cli.txt)')
	// parse
	.parse(process.argv);

Function.prototype.error = function (fn) {
	return function (err) {
		if (err) {
			fn.apply(this, arguments);
			return;
		}
		this.apply(this, Array.prototype.slice.call(arguments, 1));
	}.bind(this);
};

(function () {
	var queue = commander.args,
		next;
	
	next = function () {
		if (!queue || !queue.length) {
			console.log('Done!');
		} else {
			var begin = new Date().getTime(),
				location = queue.pop(),
				series = provider(location);
			if (!series) {
				console.log('Unknown series: ' + location);
				return next();
			}
			console.log('Fetching: ' + location);
			core.series(series, function (error) {
				if (error) {
					console.log(error);
					return;
				}
				console.log('Finished: ' + location);
				console.log('Time: ' + (new Date().getTime() - begin) + 'ms');
				next();
			});
		}
	};
	
	next();
}());