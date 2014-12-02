'use strict';
var Agent = require('./agent');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');
var persistenceName = '.mrpersistent';
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
    save(queue.save, function(saveErr) {
      if (err || saveErr) return emitter.emit('error', err || saveErr);
      emitter.emit('end', {timeInMs: Date.now() - beginTimeInMs});
    });
  });
  emitter.push = function(tasks) {
    queue.push(tasks);
  };
  process.nextTick(function() {
    queue.save = {};
    queue.push(tasks);
  });
  return emitter;
};

/**
 * Creates an agent.
 * @param {!Object} task
 * @param {function(Error, Agent)} done
 */
function createAgent(task, done) {
  processor(task.options, task.series, task.chapter, function(err, processors) {
    if (err) return done(err);
    var filePath = task.filePath;
    var Meta = shared.publisher.Meta;
    done(undefined, task.options.meta ?
      new Agent(filePath, processors) :
      new Agent(filePath, processors, new Meta(task.series, task.chapter)));
  });
}

/**
 * Enqueues the chapter.
 * @param {!IEmitter} emitter
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {!IChapter} chapter
 * @param {function(Error)} done
 */
function enqueueChapter(emitter, queue, task, chapter, done) {
  if (utilities.excluded(task.options, chapter)) return process.nextTick(done);
  var alias = shared.common.alias(task.series, chapter, task.options.extension);
  if (!alias) return process.nextTick(done);
  var filePath = path.join(task.options.output || '', alias);
  if (enqueueChapterPersistent(emitter, task, chapter, done)) return;
  utilities.duplicate(task.options, filePath, function(duplicate) {
    if (!duplicate) {
      queue.push({
        alias: alias,
        chapter: chapter,
        filePath: filePath,
        options: task.options,
        persistent: task.persistent,
        series: task.series
      });
    }
    done();
  });
}

/**
 * Checks and matches enqueuing chapter persistence records.
 * @param {!IEmitter} emitter
 * @param {!Object} task
 * @param {!IChapter} chapter
 * @param {function(Error)} done
 * @return {boolean}
 */
function enqueueChapterPersistent(emitter, task, chapter, done) {
  var alias = shared.common.alias(task.series, chapter, task.options.extension);
  var identifier = String(chapter.identifier);
  if (typeof task.persistent[identifier] !== 'undefined') {
    var basename = path.basename(alias);
    if (basename === task.persistent[identifier]) {
      process.nextTick(done);
      return true;
    }
    var output = task.options.output || '';
    var title = shared.common.alias.invalidate(task.series.title);
    var previousPath = path.join(output, title, task.persistent[identifier]);
    var currentPath = path.join(task.options.output || '', alias);
    task.persistent[identifier] = basename;
    emitter.emit('data', {item: basename, type: 'switched'});
    fs.rename(previousPath, currentPath, done);
    return true;
  }
  return false;
}

/**
 * Enqueues the series.
 * @param {!IEmitter} emitter
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {function(Error)} done
 */
function enqueueSeries(emitter, queue, task, done) {
  request(task.series, 'utf8', function(err) {
    if (err) return done(err);
    var title = shared.common.alias.invalidate(task.series.title);
    var filePath = path.join(task.options.output || '', title, persistenceName);
    fs.exists(filePath, function(exists) {
      if (!exists) {
        task.persistent = queue.save[filePath] = {};
        return enqueueSeriesNext(emitter, queue, task, done);
      }
      fs.readFile(filePath, 'utf8', function(err, contents) {
        if (err) return done(err);
        task.persistent = queue.save[filePath] = JSON.parse(contents);
        enqueueSeriesNext(emitter, queue, task, done);
      });
    });
  });
}

/**
 * Continues enqueuing the series.
 * @param {!IEmitter} emitter
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {function(Error)} done
 */
function enqueueSeriesNext(emitter, queue, task, done) {
  shared.common.async.eachSeries(task.series.children, function(chapter, next) {
    if (!chapter) return next();
    enqueueChapter(emitter, queue, task, chapter, next);
  }, done);
}

/**
 * Saves each persistent record.
 * @param {!Object.<string, !Object>} records
 * @param {function(Error)} done
 */
function save(records, done) {
  shared.common.async.eachSeries(Object.keys(records), function(key, next) {
    var value = JSON.stringify(records[key], null, '  ');
    fs.writeFile(key, value, 'utf8', function() {
      // IGNORE: The error is ignored. While the error can be valid (due to
      // permissions, for example), it is considered likely to be the result of
      // attempting to write to a folder which has not been created by an agent.
      next();
    });
  }, done);
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
  emitter.emit('data', {item: basename, type: 'fetching'});
  request(task.chapter, 'utf8', function(err) {
    if (err) return done(err);
    createAgent(task, function(err, agent) {
      if (err) return done(err);
      shared.publisher.mirror(agent, task.series, task.chapter, function(err) {
        if (err) return done(err);
        agent.publish(function(err) {
          if (err) return emitter.emit('error', err);
          if (!agent._disposed && !task.options.persistent) {
            task.persistent[task.chapter.identifier] = basename;
          }
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
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {function(Error)} done
 */
function taskSeries(emitter, queue, task, done) {
  task.series = shared.provider(task.address);
  if (task.series) return enqueueSeries(emitter, queue, task, done);
  emitter.emit('data', {item: task.address, type: 'obscured'});
  process.nextTick(done);
}
