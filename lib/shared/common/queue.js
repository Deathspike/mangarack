'use strict';

/**
 * Represents a queue.
 * @constructor
 * @param {number} maximum
 * @param {function(T, function(Error))} handler
 * @param {function(Error)=} done
 * @template T
 */
function Queue(maximum, handler, done) {
  this._current = 0;
  this._done = done;
  this._handler = handler;
  this._maximum = maximum < 1 ? 1 : maximum;
  this._queue = [];
}

/**
 * Kills the queue.
 * @param {Error} err
 */
Queue.prototype.kill = function(err) {
  this._queue = [];
  if (this._done) this._done(err);
};

/**
 * Push tasks on the queue.
 * @param {!(T|Array.<T>)} tasks
 */
Queue.prototype.push = function(tasks) {
  var that = this;
  [].concat(tasks).forEach(function(task) {
    that._queue.push(task);
  });
  while (that._queue.length && this._current < this._maximum) tryRun(that);
};

/**
 * Attempt to run an item from the queue.
 * @param {!Queue} that
 */
function tryRun(that) {
  if (that._current >= that._maximum || !that._queue.length) return;
  that._current += 1;
  that._handler(that._queue.shift(), function(err) {
    that._current -= 1;
    if (err || that._current === 0) return that.kill(err);
    tryRun(that);
  });
}

module.exports = Queue;
