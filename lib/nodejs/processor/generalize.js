'use strict';
var gm = require('gm');

/**
 * Runs the processor to generalize the image.
 * @implements {IProcessor}
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer)} done
 */
module.exports = function(buffer, done) {
  gm(buffer).sharpen(5, 1.4).normalize().toBuffer(done);
};

/**
 * Creates a processor.
 * @param {!IOptions} options
 * @return {IProcessor}
 */
module.exports.create = function(options) {
  return options.generalize ? undefined : module.exports;
};
