'use strict';
var Agent = require('./agent');
var defaultExtension = 'cbz';
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');
var persistentFilename = '.mrpersistent';
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
    if (task.chapter) return taskChapter(emitter, task, done);
    taskSeries(emitter, queue, task, done);
  }, function(err) {
    if (err) return emitter.emit('error', err);
    emitter.emit('end', {timeInMs: Date.now() - beginTimeInMs});
  });
  emitter.push = function(tasks) {
    queue.push(tasks);
  };
  process.nextTick(function() {
    queue.push(tasks.map(function(task) {
      return {address: task.address, options: task.options};
    }));
  });
  return emitter;
};

/**
 * Creates an agent.
 * @private
 * @param {!Object} task
 * @param {function(Error, Agent)} done
 */
function createAgent(task, done) {
  processor(task.options, task.series, task.chapter, function(err, processors) {
    if (err) return done(err);
    var chapterPath = task.chapterPath;
    var Meta = shared.publisher.Meta;
    done(undefined, task.options.meta ?
      new Agent(chapterPath, processors) :
      new Agent(chapterPath, processors, new Meta(task.series, task.chapter)));
  });
}

/**
 * Creates a shallow clone of the object.
 * @private
 * @param {!Object} object
 * @return {!Object}
 */
function createShallowClone(object) {
  var clone = {};
  Object.keys(object).forEach(function(key) {
    clone[key] = object[key];
  });
  return clone;
}

/**
 * Enqueues the chapter.
 * @private
 * @param {!IEmitter} emitter
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {!IChapter} chapter
 * @param {function(Error)} done
 */
function enqueueChapter(emitter, queue, task, chapter, done) {
  // Check and initialize chapter information.
  if (utilities.excluded(task.options, chapter)) return done();
  var extension = task.options.extension || defaultExtension;
  var chapterName = shared.common.alias(task.series, chapter, extension);
  if (!chapterName) return done(new Error('No chapter: ' + task.address));
  var chapterPath = path.join(task.seriesPath, chapterName);

  // Initialize the chapter task.
  var chapterTask = createShallowClone(task);
  chapterTask.chapter = chapter;
  chapterTask.chapterName = chapterName;
  chapterTask.chapterPath = chapterPath;

  // Check the persistence entry or continue to enqueue the chapter task.
  var oldName = chapterTask.persistent[chapterTask.chapter.identifier];
  if (oldName) return enqueueChapterPersistent(emitter, chapterTask, done);
  utilities.exists(chapterTask.options, chapterPath, function(exists) {
    if (!exists) queue.push(chapterTask);
    done();
  });
}

/**
 * Checks the persistence entry and renames the chapter when applicable.
 * @private
 * @param {!IEmitter} emitter
 * @param {!Object} task
 * @param {!IChapter} chapter
 * @param {function(Error)} done
 */
function enqueueChapterPersistent(emitter, task, done) {
  var oldName = task.persistent[task.chapter.identifier];
  if (task.chapterName === oldName) return done();
  var oldPath = path.join(task.seriesPath, oldName);
  task.persistent[task.chapter.identifier] = task.chapterName;
  emitter.emit('data', {item: task.chapterName, type: 'switched'});
  fs.rename(oldPath, task.chapterPath, function(err) {
    if (err) return done(err);
    save(task.persistentPath, task.persistent, done);
  });
}

/**
 * Enqueues the series.
 * @private
 * @param {!IEmitter} emitter
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {function(Error)} done
 */
function enqueueSeries(emitter, queue, task, done) {
  request(task.series, 'utf8', function(err) {
    if (err) return done(err);
    task.seriesName = shared.common.clean(task.series.title);
    if (!task.seriesName) return done(new Error('No series: ' + task.address));
    task.seriesPath = path.join(task.options.output || '', task.seriesName);
    task.persistentPath = path.join(task.seriesPath, persistentFilename);
    task.persistent = {};
    fs.exists(task.persistentPath, function(exists) {
      if (!exists) return enqueueSeriesChapters(emitter, queue, task, done);
      fs.readFile(task.persistentPath, 'utf8', function(err, data) {
        try {
          if (err) return done(err);
          task.persistent = JSON.parse(data);
          enqueueSeriesChapters(emitter, queue, task, done);
        } catch (err) {
          done(err);
        }
      });
    });
  });
}

/**
 * Enqueues each chapter in the series.
 * @private
 * @param {!IEmitter} emitter
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {function(Error)} done
 */
function enqueueSeriesChapters(emitter, queue, task, done) {
  shared.common.async.eachSeries(task.series.children, function(chapter, next) {
    enqueueChapter(emitter, queue, task, chapter, next);
  }, function(err) {
    if (err) return done(err);
    emitter.emit('data', {item: task.seriesName, type: 'surveyed'});
    done();
  });
}

/**
 * Saves a persistent record.
 * @param {string} filePath
 * @param {!Object.<string, !Object>} records
 * @param {function(Error)} done
 */
function save(filePath, record, done) {
  if (!Object.keys(record).length) return done();
  shared.common.lock(record, function(unlock) {
    var value = JSON.stringify(record, null, '  ');
    fs.writeFile(filePath, value, 'utf8', function(err) {
      unlock(); // TODO: Unlock cxan be more graceful.
      done(err);
    });
  });
}

// address
// chapter
// chapterName
// chapterPath
// persistent
// persistentPath
// options
// series
// seriesName
// seriesPath

/**
 * Runs a chapter task.
 * @param {!EventEmitter} emitter
 * @param {!Object} task
 * @param {function(Error)} done
 */
function taskChapter(emitter, task, done) {
  var begin = Date.now();
  emitter.emit('data', {item: task.chapterName, type: 'fetching'});
  request(task.chapter, 'utf8', function(err) {
    if (err) return done(err);
    createAgent(task, function(err, agent) {
      if (err) return done(err);
      shared.publisher.mirror(agent, task.series, task.chapter, function(err) {
        if (err) return done(err);
        agent.publish(function(err) {
          if (err) return done(err);
          if (!agent._disposed && !task.options.persistent) {
            task.persistent[task.chapter.identifier] = task.chapterName;
          }
          emitter.emit('data', {
            item: task.chapterName,
            timeInMs: Date.now() - begin,
            type: agent._disposed ? 'disposed' : 'finished'
          });
          save(task.persistentPath, task.persistent, done);
        });
      });
    });
  });
}

/**
 * Runs a series task.
 * @private
 * @param {!EventEmitter} emitter
 * @param {!Queue} queue
 * @param {!Object} task
 * @param {function(Error)} done
 */
function taskSeries(emitter, queue, task, done) {
  task.series = shared.provider(task.address);
  if (task.series) return enqueueSeries(emitter, queue, task, done);
  emitter.emit('data', {item: task.address, type: 'obscured'});
  done();
}
