'use strict';
var Agent = require('./agent');
var co6 = require('co6');
var fs = require('fs');
var options = require('./options');
var os = require('os');
var path = require('path');
var request = require('./request');
var shared = require('../shared');
var utilities = require('./utilities');

// Promisification
co6.promisifyAll(fs);

/**
 * Run the command line application.
 */
(function () {
    var opts = options(process.argv);
    var pool = new shared.common.Pool(opts.worker || os.cpus().length);
    return opts.args.length === 0 ?
        enqueueBatch(pool, opts.source || 'MangaRack.txt') :
        enqueueAddresses(pool, opts, opts.args);
})();

/**
 * Enqueue each address.
 * @param {!Pool} pool
 * @param {!Options} options
 * @param {!Array.<string>} addresses
 */
function enqueueAddresses(pool, options, addresses) {
    addresses.forEach(function (address) {
        var series = shared.provider(address);
        if (series) enqueueSeries(pool, options, series);
    });
}

/**
 * Enqueue the batch file.
 * @param {!Pool} pool
 * @param {string} file
 */
function enqueueBatch(pool, file) {
    fs.exists(function (exists) {
        if (!exists) return;
        fs.readFile(file, 'utf8', function (err, contents) {
            if (err) return console.error(err);
            contents.split('\n').forEach(function (line) {
                if (line) {
                    var lineOptions = options(line.split(' '));
                    enqueueAddresses(pool, lineOptions, lineOptions.args);
                }
            });
        });
    });
}

/**
 * Enqueue the chapter.
 * @param {!Pool} pool
 * @param {!Options} options
 * @param {!Series} series
 * @param {!Chapter} chapter Requires to be populated.
 */
function enqueueChapter(pool, options, series, chapter) {
    if (utilities.checkExcluded(options, chapter)) return;
    pool.enqueue(co6.coroutine(function *() {
        if (yield utilities.checkDuplicate(options, series, chapter)) return;
        var alias = shared.common.alias(series, chapter, options.extension);
        var agent = options.meta ?
            new Agent(alias) :
            new Agent(alias, new shared.publisher.Meta(series, chapter));
        console.log('Fetching ' + path.basename(alias));
        yield request(chapter);
        yield shared.publisher.mirror(agent, series, chapter);
        yield agent.publish();
        console.log('Finished ' + path.basename(alias));
    }));
}

/**
 * Enqueue the series.
 * @param {!Pool} pool
 * @param {!Options} options
 * @param {!Series} series
 */
function enqueueSeries(pool, options, series) {
    co6.spawn(request(series)).then(function () {
        series.children.forEach(function (chapter) {
            if (chapter) enqueueChapter(pool, options, series, chapter);
        });
    });
}
