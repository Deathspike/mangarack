/*jslint node: true*/
'use strict';
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
	.option('-e, --extension <s>', 'The file extension for each file. (cbz)')
	.option('-c, --chapter <n>', 'The chapter filter.')
	.option('-v, --volume <n>', 'The volume filter.')
	.option('-w, --worker <n>', 'The maximum parallel workers. (# cores)')
	.option('-s, --source <s>', 'The batch-mode source file. (cli.txt)')

	// parse
	.parse(process.argv);


// Initialize the co module.
var co = require('co');
// Initialize the core module.
var core = require('./core');
// Initialize the engine module.
var engine = require('./runtime/engine');
// Initialize the Publisher module.
var Publisher = require('./runtime/publisher');

co(function *() {
	// Initialize each location.
	var locations = commander.args;
	// Iterate through each location.
	for (var i = 0; i < locations.length; i += 1) {
		// Initialize the series.
		var series = provider(locations[i]);
		// Check if the series is valid.
		if (series) {
			// Populate the series.
			yield engine.populate(series);
			// Iterate through each chapter.
			for (var j = 0; j < series.children.length; j += 1) {
				// Initialize the chapter.
				var chapter = series.children[j];
				// Initialize the publisher.
				var publisher = new Publisher('test.zip');
				// Synchronize~
				yield core(engine, publisher.publish, series, chapter);
				// Finalize the publisher.
				yield publisher.finalize();
				console.log('Written. Breaking now!');
				break;
			}
		}
	}
})();