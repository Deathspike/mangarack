'use strict';
var gm = require('gm');

/**
 * Runs the processor to snap to the last frame.
 * @implements {IProcessor}
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer=)} done
 */
module.exports = function(buffer, done) {
  if (buffer.slice(0, 3).toString('hex') !== '474946') {
    return done(undefined, buffer);
  }
  gm(buffer).flatten().toBuffer('jpg', function(err, buffer) {
    done(undefined, buffer || undefined);
  });
};

/**
 * Creates a processor.
 * @param {!IOptions} options
 * @returns {IProcessor}
 */
module.exports.create = function(options) {
  return options.animation ? undefined : module.exports;
};
