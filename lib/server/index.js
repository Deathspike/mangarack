'use strict';
var Agent = require('./agent');
var co6 = require('co6');
var path = require('path');
var request = require('./request');
var shared = require('../shared');
var utilities = require('./utilities');

/**
 * Returns a promise which resolves when the tasks have been completed.
 * @param {!Array.<!{address: string, options: !Options}>} tasks
 * @param {number=} maximum
 * @param {function(string)=) emit
 * @return {!Promise}
 */
module.exports = function (tasks, maximum, emit) {
    var pool = new (shared.common.Pool)(maximum || 1);
    emit = emit || function () {};
    tasks.forEach(function (task) {
        var series = shared.provider(task.address);
        if (series) return enqueueSeries(emit, pool, task.options, series);
        emit('Obscured ' + task.address);
    });
    return pool.promise();
};

/**
 * Create an agent.
 * @param {!Options} options
 * @param {!Series} series
 * @param {!Chapter} chapter
 * @param {string} alias
 * @return {!Agent}
 */
function createAgent(options, series, chapter, alias) {
    if (options.meta) return new Agent(alias);
    return new Agent(alias, new shared.publisher.Meta(series, chapter));
}

/**
 * Enqueue the chapter.
 * @param {function(string)) emit
 * @param {!Pool} pool
 * @param {!Options} options
 * @param {!Series} series
 * @param {!Chapter} chapter Requires to be populated.
 */
function enqueueChapter(emit, pool, options, series, chapter) {
    if (utilities.excluded(options, chapter)) return;
    pool.enqueue(co6.coroutine(function *() {
        if (yield utilities.duplicate(options, series, chapter)) return;
        var alias = shared.common.alias(series, chapter, options.extension);
        var agent = createAgent(options, series, chapter, alias);
        emit('Fetching ' + path.basename(alias));
        yield request(chapter);
        yield shared.publisher.mirror(agent, series, chapter);
        yield agent.publish();
        emit('Finished ' + path.basename(alias));
    }));
}

/**
 * Enqueue the series.
 * @param {function(string)} emit
 * @param {!Pool} pool
 * @param {!Options} options
 * @param {!Series} series
 */
function enqueueSeries(emit, pool, options, series) {
    co6.spawn(request(series)).then(function () {
        series.children.forEach(function (chapter) {
            if (!chapter) return;
            enqueueChapter(emit, pool, options, series, chapter);
        });
    });
}
