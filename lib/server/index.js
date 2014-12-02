'use strict';
var Agent = require('./agent');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var processor = require('./processor');
var request = require('./request');
var shared = require('../shared');
var utilities = require('./utilities');

/**
 * Runs the tasks in a queue and returns an event emitter.
 * @param {!Array.<!{address: string, options: !IOptions}>} tasks
 * @param {number=} maximum
 * @return {!IEmitter}
 */
module.exports = function(tasks, maximum) {
  var beginTimeInMs = Date.now();
  var emitter = new EventEmitter();
  var queue = new shared.common.Queue(maximum, function(task, done) {
    if (task.alias) return taskChapter(emitter, task, done);
    taskSeries(emitter, queue, task, done);
  }, function(err) {
    if (err) return emitter.emit('error', err);
    emitter.emit('end', {timeInMs: Date.now() - beginTimeInMs});
  });
  emitter.push = function(tasks) {
    queue.push(tasks);
  };
  process.nextTick(function() {
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
  var filePath = path.join(options.output || '', alias);
  utilities.duplicate(options, filePath, function(duplicate) {
    if (!duplicate) {
      queue.push({
        alias: alias,
        chapter: chapter,
        options: options,
        series: series
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
    shared.common.async.eachSeries(series.children, function(chapter, next) {
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
  var options = task.options;
  var series = task.series;
  emitter.emit('data', {item: basename, type: 'fetching'});
  request(chapter, 'utf8', function(err) {
    if (err) return done(err);
    createAgent(options, series, chapter, task.alias, function(err, agent) {
      if (err) return done(err);
      shared.publisher.mirror(agent, series, chapter, function(err) {
        if (err) return done(err);
        agent.publish(function(err) {
          if (err) return emitter.emit('error', err);
          emitter.emit('data', {
            item: basename,
            timeInMs: Date.now() - begin,
            type: agent._disposed ? 'disposed' : 'finished'
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
