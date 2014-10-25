'use strict';
var commander = require('commander');
var co = require('co');
var mirror = require('./mirror');
var provider = require('../shared').provider;
var request = require('./request');

commander.version('3.0.0')
    // Enables/disables.
    .option('-a, --animation', 'Disable animation framing')
    .option('-d, --duplication', 'Disable duplication prevention')
    .option('-f, --footer', 'Disable footer incision')
    .option('-g, --grayscale', 'Disable grayscale size comparison and save.')
    .option('-i, --image', 'Disable image processing.')
    .option('-m, --meta', 'Disable embedded meta-information.')
    .option('-p, --persistent', 'Enable persistent synchronization')
    .option('-r, --repair', 'Disable repair and error tracking.')
    // Filters and options.
    .option('-e, --extension <s>', 'The file extension for each file. (cbz)')
    .option('-c, --chapter <n>', 'The chapter filter.')
    .option('-v, --volume <n>', 'The volume filter.')
    .option('-w, --worker <n>', 'The maximum parallel workers. (# cores)')
    .option('-s, --source <s>', 'The batch-mode source file. (cli.txt)')
    .parse(process.argv);

co(function *() {
    var addresses = commander.args;
    for (var i = 0; i < addresses.length; i += 1) {
        var series = provider(addresses[i]);
        if (series) {
            yield request(series);
            for (var j = 0; j < series.children.length; j += 1) {
                var chapter = series.children[j];
                yield request(chapter);
                yield mirror(commander, series, chapter);
                console.log('Ending now.');
                return;
            }
        }
    }
})();
