'use strict';

/**
 * Represents a pool.
 * @class
 * @param {number} maximum
 */
function Pool(maximum) {
    this._current = 0;
    this._disposed = false;
    this._maximum = maximum;
    this._resolvers = [];
    this._rejecters = [];
    this._tasks = [];
}

/**
 * Dispose of the pool.
 * @param {string=} err
 */
Pool.prototype.dispose = function (err) {
    if (this._disposed) return;
    this._disposed = true;
    this._rejecters.forEach(function (reject) {
        reject(err || 'The queue is disposing.');
    });
};

/**
 * Enqueue a task which produces a promise.
 * @param {function(): !Promise} task
 */
Pool.prototype.enqueue = function (task) {
    this._tasks.push(task);
    if (this._current >= this._maximum) return;
    var that = this;
    var next = function () {
        that._current -= 1;
        if (that._disposed) return;
        if (that._tasks.length && that._current < that._maximum) return run();
        that._disposed = true;
        that._resolvers.forEach(function (resolve) {
            resolve();
        });
    };
    var run = function () {
        that._current += 1;
        that._tasks.shift()().then(next, function (err) {
            that.dispose(err);
        });
    };
    run();
};

/**
 * Returns a promise which resolves when the pool is empty after running tasks.
 * @returns {!Promise}
 */
Pool.prototype.promise = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        that._resolvers.push(resolve);
        that._rejecters.push(reject);
    });
};

module.exports = Pool;
