'use strict';
var co = require('co');
var commander = require('commander');
var mirror = require('./mirror');
var path = require('path');
var provider = require('../shared').provider;
var utilities = require('./utilities');

// TODO: `batch mode`

commander.version(require('../../package').version)
    // Enables/disables.
    // X.option('-a, --animation', 'Disable animation framing')
    .option('-d, --duplication', 'Disable duplication prevention')
    // X.option('-f, --footer', 'Disable footer incision')
    // X.option('-g, --grayscale', 'Disable grayscale size comparison+save.')
    // X.option('-i, --image', 'Disable image processing.')
    // X.option('-m, --meta', 'Disable embedded meta-information.')
    // X.option('-p, --persistent', 'Enable persistent synchronization')
    // X.option('-r, --repair', 'Disable repair and error tracking.')
    // Filters and options.
    .option('-e, --extension <s>', 'The file extension for each file. (cbz)')
    .option('-c, --chapter <n>', 'The chapter filter.')
    .option('-v, --volume <n>', 'The volume filter.')
    // X.option('-w, --worker <n>', 'The maximum parallel workers. (# cores)')
    // X.option('-s, --source <s>', 'The batch-mode source file. (cli.txt)')
    .parse(process.argv);

co(function *(options) {
    console.log(commander.args);
    var addresses = commander.args;
    for (var i = 0; i < addresses.length; i += 1) {
        var series = provider(addresses[i]);
        if (series) {
            yield processSeries(options, series);
        }
    }
})(commander);

/**
 * Process the chapter.
 * @param {!Options} options
 * @param {!Series} series
 * @param {!Chapter} chapter Requires to be populated.
 */
function *processChapter(options, series, chapter) {
    if (!(yield utilities.checkDuplicate(options, series, chapter)) &&
        !utilities.checkExcluded(options, chapter)) {
        var pathToBook = utilities.createPathToBook(series, chapter);
        var book = path.basename(pathToBook, '.cbz');
        console.log('Fetching ' + book);
        yield utilities.request(chapter);
        yield mirror(series, chapter, commander.extension);
        console.log('Finished ' + book);
    }
}

/**
 * Process the series.
 * @param {!Options} options
 * @param {!Series} series
 * @param {!Chapter} chapter Requires to be populated.
 */
function *processSeries(options, series) {
    yield utilities.request(series);
    for (var j = 0; j < series.children.length; j += 1) {
        var chapter = series.children[j];
        if (chapter) {
            yield processChapter(options, series, chapter);
        }
    }
}
