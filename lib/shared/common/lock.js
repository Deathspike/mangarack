'use strict';
var locker = {};

/**
 * Achieve a lock on the item.
 * @param {!Object} item
 * @param {function(function())} callback
 */
module.exports = function(item, callback) {
  if (locker[item]) return locker[item].push(callback);
  locker[item] = [callback];
  runLock(item);
};

/**
 * Runs a callback from an item lock.
 * @param {!Object} item
 */
function runLock(item) {
  var fn = locker[item].shift();
  fn(function() {
    if (!locker[item].length) return (locker[item] = undefined);
    runLock(item);
  });
}
