'use strict';
var Agent = require('./agent');
var async = require('async');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var processor = require('./processor');
var request = require('./request');
var shared = require('../shared');
var utilities = require('./utilities');

/**
 * Runs the tasks in a queue and returns an event emitter.
 * @param {!Array.<!{address: string, options: !IOptions}>} tasks
 * @param {number=} workers
 * @return {!IEmitter}
 */
module.exports = function(tasks, workers) {
  var beginTimeInMs = Date.now();
  var emitter = new EventEmitter();
  var queue = async.queue(function(task, done) {
    done = createTaskCallback(emitter, queue, done);
    if (task.alias) return taskChapter(emitter, task, done);
    taskSeries(emitter, queue, task, done);
  }, workers);
  emitter.push = function(tasks) {
    queue.push(tasks);
  };
  process.nextTick(function() {
    queue.drain = function() {
      emitter.emit('end', {timeInMs: Date.now() - beginTimeInMs});
    };
    queue.push(tasks);
  });
  return emitter;
};

/**
 * Creates an agent.
 * @param {!IOptions} options
 * @param {!ISeries} series
 * @param {!IChapter} chapter
 * @param {string} alias
 * @param {function(Error, Agent)} done
 */
function createAgent(options, series, chapter, alias, done) {
  var filePath = path.join(options.output || '', alias);
  processor(options, series, chapter, function(err, processors) {
    if (err) return done(err);
    var Meta = shared.publisher.Meta;
    done(undefined, options.meta ?
      new Agent(filePath, processors) :
      new Agent(filePath, processors, new Meta(series, chapter)));
  });
}

/**
 * Creates a task callback, which emits and kills the queue on an error.
 * @param {!EventEmitter} emitter
 * @param {!{kill: function(), push: function(!Object)}} queue
 * @param {function()} done
 */
function createTaskCallback(emitter, queue, done) {
  return function(err) {
    if (!err) return done();
    emitter.emit('error', err);
    queue.kill();
  };
}

/**
 * Enqueues the chapter.
 * @param {!{kill: function(), push: function(!Object)}} queue
 * @param {!IOptions} options
 * @param {!ISeries} series The populated series.
 * @param {!IChapter} chapter
 * @param {function(Error)} done
 */
function enqueueChapter(queue, options, series, chapter, done) {
  if (utilities.excluded(options, chapter)) return process.nextTick(done);
  var alias = shared.common.alias(series, chapter, options.extension);
  if (!alias) return process.nextTick(done);
  utilities.duplicate(options, alias, function(err, duplicate) {
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
 * @param {!{kill: function(), push: function(!Object)}} queue
 * @param {!IOptions} options
 * @param {!ISeries} series
 * @param {function(Error)} done
 */
function enqueueSeries(queue, options, series, done) {
  request(series, 'utf8', function(err) {
    if (err) return done(err);
    async.eachSeries(series.children, function(chapter, next) {
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
  var alias = task.alias;
  var basename = path.basename(alias);
  var begin = Date.now();
  var chapter = task.chapter;
  var options = task.options;
  var series = task.series;
  emitter.emit('data', {item: basename, type: 'fetching'});
  request(chapter, 'utf8', function(err) {
    if (err) return done(err);
    createAgent(options, series, chapter, alias, function(err, agent) {
      if (err) return done(err);
      shared.publisher.mirror(agent, series, chapter, function(err) {
        if (err) return done(err);
        agent.publish(function(err) {
          if (err) return emitter.emit('error', err);
          emitter.emit('data', {
            item: basename,
            timeInMs: Date.now() - begin,
            type: 'finished'
          });
          done();
        });
      });
    });
  });
}

/**
 * Runs a series task.
 * @param {!EventEmitter} emitter
 * @param {!{kill: function(), push: function(!Object)}} queue
 * @param {!Object} task
 * @param {function(Error)} done
 */
function taskSeries(emitter, queue, task, done) {
  var series = shared.provider(task.address);
  if (series) return enqueueSeries(queue, task.options, series, done);
  emitter.emit('data', {item: task.address, type: 'obscured'});
  process.nextTick(done);
}
