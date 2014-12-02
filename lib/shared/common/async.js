'use strict';

/**
 * Invokes the callback on the next tick.
 * @param {function(Error)} done
 * @param {Error} err
 */
module.exports.nextTick = createNextTick();

/**
 * Iterate through asynchronously through each array item.
 * @param {!Array.<T>} array
 * @param {function(T, function(Error))} iterator
 * @param {function(Error)} done
 * @template T
 */
module.exports.eachSeries = function(array, iterator, done) {
  var i = 0;
  (function iterate() {
    iterator(array[i], function(err) {
      if (err) return module.exports.nextTick(done, err);
      i += 1;
      if (i >= array.length) return module.exports.nextTick(done);
      iterate();
    });
  })();
};

/**
 * Creates a function which invokes a callback on the next tick.
 * @return {function(function(Error), Error)}
 */
function createNextTick() {
  if (typeof process === 'undefined' || !process.nextTick) {
    return function(done, err) {
      setTimeout(function() {
        done(err);
      }, 0);
    };
  }
  return function(done, err) {
    process.nextTick(function() {
      done(err);
    });
  };
}
