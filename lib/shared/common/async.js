'use strict';

/**
 * Iterate through each array item in series.
 * @param {!Array.<T>} array
 * @param {function(T, function(Error))} iterator
 * @param {function(Error)} done
 * @template T
 */
module.exports.eachSeries = function(array, iterator, done) {
  var i = 0;
  if (!array.length) return done();
  (function iterate() {
    iterator(array[i], function(err) {
      if (err) return done(err);
      i += 1;
      if (i >= array.length) return done();
      iterate();
    });
  })();
};
