'use strict';
var co = require('co');
var fs = require('co-fs');
var mirror = require('./mirror');
var options = require('./options');
var path = require('path');
var provider = require('../shared').provider;
var utilities = require('./utilities');

/**
 * Run the command line application.
 */
co(function *(options) {
    return options.args.length === 0 ?
        yield processBatch(options.source || 'MangaRack.txt') :
        yield processAddresses(options, options.args);
})(options().parse(process.argv));

/**
 * Process each address.
 * @param {!Options} options
 * @param {!Array.<string>} addresses
 */
function *processAddresses(options, addresses) {
    for (var i = 0; i < addresses.length; i += 1) {
        var address = addresses[i];
        var series = provider(address);
        if (series) {
            yield processSeries(options, series);
        } else {
            console.log('Ignoring ' + address);
        }
    }
}

/**
 * Process the batch file.
 * @param {string} file
 */
function *processBatch(file) {
    if (yield fs.exists(file)) {
        var lines = (yield fs.readFile(file, 'utf8')).split('\n');
        for (var i = 0; i < lines.length; i += 1) {
            var line = lines[i];
            if (line) {
                var lineOptions = options().parse(lines[i].split(' '));
                yield processAddresses(lineOptions, lineOptions.args);
            }
        }
    }
}

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
        yield mirror(series, chapter, options.extension);
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
