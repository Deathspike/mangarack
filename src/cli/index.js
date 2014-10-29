'use strict';
var Agent = require('./agent');
var Bluebird = require('bluebird');
var fs = require('./fs');
var options = require('./options');
var path = require('path');
var request = require('./request');
var shared = require('../shared');
var utilities = require('./utilities');

/**
 * Run the command line application.
 */
Bluebird.coroutine.addYieldHandler(function (n) {
    if (n && typeof n.next === 'function' &&  typeof n.throw === 'function') {
        return Bluebird.coroutine(function *() {
            return yield *n;
        })();
    }
});

Bluebird.coroutine(function *(options) {
    return options.args.length === 0 ?
        yield handleBatch(options.source || 'MangaRack.txt') :
        yield handleAddresses(options, options.args);
})(options(process.argv));

/**
 * Handles each address.
 * @param {!Options} options
 * @param {!Array.<string>} addresses
 */
function *handleAddresses(options, addresses) {
    for (var i = 0; i < addresses.length; i += 1) {
        var address = addresses[i];
        var series = shared.provider(address);
        if (series) {
            yield handleSeries(options, series);
        } else {
            console.log('Ignoring ' + address);
        }
    }
}

/**
 * Handles the batch file.
 * @param {string} file
 */
function *handleBatch(file) {
    if (yield fs.existsAsync(file)) {
        var lines = (yield fs.readFileAsync(file, 'utf8')).split('\n');
        for (var i = 0; i < lines.length; i += 1) {
            var line = lines[i];
            if (line) {
                var lineOptions = options(lines[i].split(' '));
                yield handleAddresses(lineOptions, lineOptions.args);
            }
        }
    }
}

/**
 * Handles the chapter.
 * @param {!Options} options
 * @param {!Series} series
 * @param {!Chapter} chapter Requires to be populated.
 */
function *handleChapter(options, series, chapter) {
    if (!(yield utilities.checkDuplicate(options, series, chapter)) &&
        !utilities.checkExcluded(options, chapter)) {
        var alias = shared.common.alias(series, chapter, options.extension);
        var agent = new Agent(alias);
        console.log('Fetching ' + path.basename(alias));
        yield request(chapter);
        yield shared.publisher.mirror(agent, series, chapter);
        yield agent.publish();
        console.log('Finished ' + path.basename(alias));
    }
}

/**
 * Handles the series.
 * @param {!Options} options
 * @param {!Series} series
 * @param {!Chapter} chapter
 */
function *handleSeries(options, series) {
    yield request(series);
    for (var j = 0; j < series.children.length; j += 1) {
        var chapter = series.children[j];
        if (chapter) {
            yield handleChapter(options, series, chapter);
        }
    }
}
