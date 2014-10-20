// Enable restricted mode.
'use strict';
// Initialize the commander module.
var commander = require('commander');
// Initialize the shared module.
var shared = require('./shared');

// todo: kissmanga uses domain full name inside series.js
// todo: rename 'location'?

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
    var locations = commander.args;
    for (var i = 0; i < locations.length; i += 1) {
        var series = shared.provider(locations[i]);
        if (series) {
            yield runtime.engine.populate(series);
            for (var j = 0; j < series.children.length; j += 1) {
                var chapter = series.children[j];
                var publisher = new runtime.Publisher('tmp/test.zip');
                yield shared.core(runtime.engine, publisher, series, chapter);
                publisher.finalize();
                console.log('Written. Breaking now!');
                break;
            }
        }
    }
})(function (error) {
    console.log(error);
});
