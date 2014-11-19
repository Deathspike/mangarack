'use strict';
var Agent = require('./agent');
var async = require('async');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var request = require('./request');
var shared = require('../shared');
var utilities = require('./utilities');

/**
 * Returns a promise which resolves when the tasks have been completed.
 * @param {!Array.<!{address: string, options: !Options}>} tasks
 * @param {number=} workers
 * @return {!EventEmitter}
 */
module.exports = function (tasks, workers) {
    var emitter = new EventEmitter();
    var queue = async.queue(function (task, done) {
        var doneWithEmitter = function (err) {
            if (!err) return done();
            emitter.emit('error', err);
            queue.kill();
        };
        if (task.alias) return taskChapter(emitter, task, doneWithEmitter);
        taskSeries(emitter, queue, task, doneWithEmitter);
    }, workers);
    process.nextTick(function () {
        queue.drain = function () {
            emitter.emit('end');
        };
        queue.push(tasks);
    });
    return emitter;
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
 * @param {!Queue} queue
 * @param {!Options} options
 * @param {!Series} series The populated series.
 * @param {!Chapter} chapter
 * @param {function(Error)} done
 */
function enqueueChapter(queue, options, series, chapter, done) {
    if (utilities.excluded(options, chapter)) return process.nextTick(done);
    var alias = shared.common.alias(series, chapter, options.extension);
    if (!alias) return process.nextTick(done);
    utilities.duplicate(options, alias, function (duplicate) {
        if (!duplicate) queue.push({
            alias: alias,
            options: options,
            series: series,
            chapter: chapter
        });
        done();
    });
}

/**
 * Enqueue the series.
 * @param {!Queue} queue
 * @param {!Options} options
 * @param {!Series} series
 * @param {function(Error)} done
 */
function enqueueSeries(queue, options, series, done) {
    request(series, 'utf8', function (err) {
        if (err) return done(err);
        async.eachSeries(series.children, function (chapter, next) {
            if (!chapter) return next();
            enqueueChapter(queue, options, series, chapter, next);
        }, done);
    });
}

/**
 * Run a chapter task.
 * @param {!EventEmitter} emitter
 * @param {!Object} task
 * @param {function(Error)} done
 */
function taskChapter(emitter, task, done) {
    var basename = path.basename(task.alias);
    var chapter = task.chapter;
    var series = task.series;
    emitter.emit('data', 'Fetching ' + basename);
    request(chapter, 'utf8', function (err) {
        if (err) return done(err);
        var agent = createAgent(task.options, series, chapter, task.alias);
        shared.publisher.mirror(agent, series, chapter, function (err) {
            if (err) return done(err);
            agent.publish(function (err) {
                if (err) return emitter.emit('error', err);
                emitter.emit('data', 'Finished ' + basename);
                done();
            });
        });
    });
}

/**
 * Run a series task.
 * @param {!EventEmitter} emitter
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {function(Error)} done
 */
function taskSeries(emitter, queue, task, done) {
    var series = shared.provider(task.address);
    if (series) return enqueueSeries(queue, task.options, series, done);
    emitter.emit('data', 'Obscured ' + task.address);
    process.nextTick(done);
}
