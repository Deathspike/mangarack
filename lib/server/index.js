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
    var begin = Date.now();
    var emitter = new EventEmitter();
    var queue = async.queue(function (task, done) {
        done = createTaskCallback(emitter, queue, done);
        if (task.alias) return taskChapter(emitter, task, done);
        taskSeries(emitter, queue, task, done);
    }, workers);
    process.nextTick(function () {
        queue.drain = function () {
            emitter.emit('end', {time: Date.now() - begin});
        };
        queue.push(tasks);
    });
    return emitter;
};

/**
 * Creates an agent.
 * @param {!Options} options
 * @param {!Series} series
 * @param {!Chapter} chapter
 * @param {string} alias
 * @return {!Agent}
 */
function createAgent(options, series, chapter, alias) {
    var filePath = path.join(options.output || '', alias);
    if (options.meta) return new Agent(filePath);
    return new Agent(filePath, new shared.publisher.Meta(series, chapter));
}

/**
 * Creates a task callback, which emits and kills the queue on an error.
 * @param {!EventEmitter} emitter
 * @param {!Queue} queue
 * @param {function()} done
 */
function createTaskCallback(emitter, queue, done) {
    return function (err) {
        if (!err) return done();
        emitter.emit('error', err);
        queue.kill();
    };
}

/**
 * Enqueues the chapter.
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
    utilities.duplicate(options, alias, function (err, duplicate) {
        if (!duplicate) {
            queue.push({
                alias: alias,
                options: options,
                series: series,
                chapter: chapter
            });
        }
        done();
    });
}

/**
 * Enqueues the series.
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
 * Runs a chapter task.
 * @param {!EventEmitter} emitter
 * @param {!Object} task
 * @param {function(Error)} done
 */
function taskChapter(emitter, task, done) {
    var basename = path.basename(task.alias);
    var begin = Date.now();
    var chapter = task.chapter;
    var series = task.series;
    emitter.emit('data', {item: basename, type: 'fetching'});
    request(chapter, 'utf8', function (err) {
        if (err) return done(err);
        var agent = createAgent(task.options, series, chapter, task.alias);
        shared.publisher.mirror(agent, series, chapter, function (err) {
            if (err) return done(err);
            agent.publish(function (err) {
                if (err) return emitter.emit('error', err);
                emitter.emit('data', {
                    item: basename,
                    time: Date.now() - begin,
                    type: 'finished'
                });
                done();
            });
        });
    });
}

/**
 * Runs a series task.
 * @param {!EventEmitter} emitter
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {function(Error)} done
 */
function taskSeries(emitter, queue, task, done) {
    var series = shared.provider(task.address);
    if (series) return enqueueSeries(queue, task.options, series, done);
    emitter.emit('data', {item: task.address, type: 'obscured'});
    process.nextTick(done);
}
