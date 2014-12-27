'use strict';

/**
 * Achieve a lock on the item.
 * @param {!Object} item
 * @param {function(function())} callback
 */
module.exports = function(item, callback) {
  if (item._lock) return item._lock.push(callback);
  item._lock = [callback];
  _run(item);
};

/**
 * Runs a callback from an item lock.
 * @private
 * @param {!Object} item
 */
function _run(item) {
  var callback = item._lock.shift();
  callback(function() {
    if (!item._lock.length) return (item._lock = undefined);
    _run(item);
  });
}
