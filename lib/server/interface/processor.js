/*jshint -W027, -W098*/
'use strict';

/**
 * Runs the processor.
 * @interface
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer)} done
 */
function IProcessor(buffer, done) {
    process.nextTick(function () {
        done(new Error('Not implemented.'));
    });
}

/**
 * Checks whether the processor is available.
 * @param {!IOptions} options
 * @return {boolean}
 */
module.exports.check = function (options) {
    throw new Error('Not implemented.');
    return false;
};

module.exports = IProcessor;
