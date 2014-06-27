// Enable restricted mode.
'use strict';
// Initialize the commander module.
var commander = require('commander');
// Initialize the shared module.
var shared = require('./shared');

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
// Initialize the runtime module.
var runtime = require('./server/runtime');

co(function *() {
    // Initialize each location.
    var locations = commander.args;
    // Iterate through each location.
    for (var i = 0; i < locations.length; i += 1) {
        // Initialize the series.
        var series = shared.provider(locations[i]);
        // Check if the series is valid.
        if (series) {
            // Populate the series.
            yield runtime.engine.populate(series);
            // Iterate through each chapter.
            for (var j = 0; j < series.children.length; j += 1) {
                // Initialize the chapter.
                var chapter = series.children[j];
                // Initialize the publisher.
                var publisher = new runtime.Publisher('tmp/test.zip');
                // Synchronize the chapter.
                yield shared.core(runtime.engine, publisher, series, chapter);
                // Finalize the publisher.
                publisher.finalize();
                console.log('Written. Breaking now!');
                break;
            }
        }
    }
})(function (error) {
    console.log(error);
});
