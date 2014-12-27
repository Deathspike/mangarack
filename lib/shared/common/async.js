'use strict';

/**
 * Iterate through each array item in series.
 * @param {!Array.<T>} array
 * @param {function(T, function(Error))} iterator
 * @param {function(Error=)} done
 * @template T
 */
module.exports.eachSeries = function(array, iterator, done) {
  if (!array.length) return done();
  _iterate(array, iterator, 0, done);
};

/**
 * Iterates over the array.
 * @private
 * @param {!Array.<T>} array
 * @param {function(T, function(Error))} iterator
 * @param {number} i
 * @param {function(Error=)} done
 * @template T
 */
function _iterate(array, iterator, i, done) {
  iterator(array[i], function(err) {
    if (err) return done(err);
    if (i + 1 >= array.length) return done();
    _iterate(array, iterator, i + 1, done);
  });
}
