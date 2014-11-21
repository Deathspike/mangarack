'use strict';
var gm = require('gm');

/**
 * Runs the processor to normalize the image.
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer)} done
 */
module.exports = function (buffer, done) {
    gm(buffer).sharpen(5, 1.4).normalize().toBuffer(done);
};

/**
 * Checks whether the processor is available.
 * @param {!Options} options
 * @return {boolean}
 */
module.exports.check = function (options) {
    return !options.normalize;
};
