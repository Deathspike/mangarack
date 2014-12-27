'use strict';
var gm = require('gm');

/**
 * Runs the processor to transform the image to the specified output format.
 * @implements {IProcessor}
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer)} done
 */
module.exports = function(buffer, done) {
  done(undefined, buffer);
};

/**
 * Creates a processor.
 * @param {!IOptions} options
 * @returns {IProcessor}
 */
module.exports.create = function(options) {
  if (!options.transform) return undefined;
  return function(buffer, done) {
    gm(buffer).toBuffer(options.transform, done);
  };
};
