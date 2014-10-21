'use strict';
var commander = require('commander');
var co = require('co');
var core = require('./core');
var runtime = require('./runtime');
var shared = require('../shared');

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


co(function *() {
    var addresses = commander.args;
    for (var i = 0; i < addresses.length; i += 1) {
        var series = shared.provider(addresses[i]);
        if (series) {
            yield runtime.engine.populate(series);
            for (var j = 0; j < series.children.length; j += 1) {
                var chapter = series.children[j];
                var publisher = new runtime.Publisher('tmp/test.zip');
                yield core(runtime.engine, publisher, series, chapter);
                publisher.finalize();
                console.log('Written. Breaking now!');
                break;
            }
        }
    }
})();
