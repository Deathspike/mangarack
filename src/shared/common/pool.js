'use strict';

/**
 * Represents a pool.
 * @class
 * @param {number} maximum
 */
function Pool(maximum) {
    this._maximum = maximum;
    this._running = 0;
    this._queue = [];
}

/**
 * Enqueue a task which produces a promise.
 * @param {function(): !Promise} task
 */
Pool.prototype.enqueue = function (task) {
    this._queue.push(task);
    if (this._running >= this._maximum) return;
    var that = this;
    var next = function () {
        that._running -= 1;
        if (that._running < that._maximum) run();
    };
    var run = function () {
        if (!that._queue.length) return;
        that._running += 1;
        that._queue.shift()().then(next, next);
    };
    run();
};

if (typeof module !== 'undefined') {
    module.exports = Pool;
}
