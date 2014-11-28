/*jshint -W098*/
'use strict';

/**
 * Runs the processor.
 * @interface
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer)} done
 */
function IProcessor(buffer, done) {
  throw new Error('Not implemented.');
}

/**
 * Checks whether the processor is available.
 * @param {!IOptions} options
 * @return {boolean}
 */
module.exports.check = function(options) {
  throw new Error('Not implemented.');
};

module.exports = IProcessor;
