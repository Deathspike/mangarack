/*jshint -W098*/
'use strict';

/**
 * Represents an event emitter with a task queue.
 * @interface
 * @implements {EventEmitter}
 */
function IEmitter() {
  throw new Error('Not implemented.');
}

/**
 * Push a task to the queue.
 * @param {!{address: string, options: !IOptions}} task
 */
IEmitter.push = function(task) {
  throw new Error('Not implemented.');
};

module.exports = IEmitter;
