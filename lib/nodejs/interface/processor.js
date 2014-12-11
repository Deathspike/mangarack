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
 * Creates a processor.
 * @param {!IOptions} options
 * @param {!ISeries} series
 * @param {!IChapter} chapter
 * @return {IProcessor}
 */
module.exports.create = function(options, series, chapter) {
  throw new Error('Not implemented.');
};

module.exports = IProcessor;
