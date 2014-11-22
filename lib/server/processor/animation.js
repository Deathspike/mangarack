'use strict';
var gm = require('gm');

/**
 * Runs the processor to snap to the last frame.
 * @implements {IProcessor}
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer)} done
 */
module.exports = function (buffer, done) {
    if (buffer.slice(0, 3).toString('hex') !== '474946') {
        return process.nextTick(function () {
            done(undefined, buffer);
        });
    }
    gm(buffer).flatten().toBuffer('jpg', done);
};

/**
 * Checks whether the processor is available.
 * @param {!IOptions} options
 * @return {boolean}
 */
module.exports.check = function (options) {
    return !options.animation;
};
