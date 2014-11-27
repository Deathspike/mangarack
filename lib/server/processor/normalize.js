'use strict';
var gm = require('gm');

/**
 * Runs the processor to normalize the image.
 * @implements {IProcessor}
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer)} done
 */
module.exports = function(buffer, done) {
  gm(buffer).sharpen(5, 1.4).segment().normalize(0.015, 1.5).toBuffer(done);
};

/**
 * Checks whether the processor is available.
 * @param {!IOptions} options
 * @return {boolean}
 */
module.exports.check = function(options) {
  return !options.normalize;
};
