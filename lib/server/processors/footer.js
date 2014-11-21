'use strict';
var gm = require('gm');
var Series = require('../../shared/provider/mangafox/series');

/**
 * Runs the processor to crop a black on white textual footer.
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer)} done
 */
module.exports = function (buffer, done) {
    load(buffer, function (err, data) {
        if (err) return done(err);
        var lines = countNumberOfLines(data);
        if (isNaN(lines)) return done(undefined, buffer);
        gm(buffer).crop(data.width, data.height - lines, 0, 0).toBuffer(done);
    });
};

/**
 * Checks whether the processor is available.
 * @param {!Options} options
 * @param {!Series} series
 * @return {boolean}
 */
module.exports.check = function (options, series) {
    return !options.footer && series instanceof Series;
};

/**
 * Count the number of lines to crop.
 * @param {!{rgb: !Buffer, height: number, width: number}} data
 * @returns {number}
 */
function countNumberOfLines(data) {
    var count = NaN;
    var from = NaN;
    var to = NaN;
    for (var ry = 0; ry < 80 && ry < data.height; ry += 1) {
        var channel = readChannelOrIsBlack(data, data.height - ry - 1);
        if (!channel) {
            if (ry === 0) return NaN;
            from = usePreviousOrClamp(from, ry, 5);
            to = ry;
        } else if (!isNaN(from) && !isNaN(to) && isWhite(channel)) {
            count = from + to;
        }
    }
    return count;
}

/**
 * Loads the RGB pixel buffer and the dimensions for the buffer.
 * @param {!Buffer} buffer
 * @param {function(Error, {rgb: !Buffer, height: number, width: number})} done
 */
function load(buffer, done) {
    var data = {};
    gm(buffer).setFormat('rgb').size(function (err, size) {
        if (err) return done(err);
        data.height = size.height;
        data.width = size.width;
    }).toBuffer(function (err, buffer) {
        if (err) return done(err);
        data.rgb = buffer;
        done(undefined, data);
    });
}

/**
 * Determines if the channel is white.
 * @param {!{r: number, g: number, b: number}} channel
 * @return {boolean}
 */
function isWhite(channel) {
    return channel.r >= 245 && channel.g >= 245 && channel.b >= 245;
}

/**
 * Returns the channel, or undefined when the line contains black.
 * @param {!{buffer: !Buffer, height: number, width: number}} data
 * @param {number} y
 * @return {{r: number, g: number, b: number}}
 */
function readChannelOrIsBlack(data, y) {
    var total = {r: 0, g: 0, b: 0};
    for (var x = 0; x < data.width; x += 1) {
        var pixel = readPixel(data, x, y);
        if (pixel.r < 45 || pixel.g < 45 || pixel.b < 45) return undefined;
        total.r += pixel.r;
        total.g += pixel.g;
        total.b += pixel.b;
    }
    return {
        r: Math.round(total.r / data.width),
        g: Math.round(total.g / data.width),
        b: Math.round(total.b / data.width)
    };
}

/**
 * Returns the pixel.
 * @param {!{buffer: !Buffer, height: number, width: number}} data
 * @param {number} x
 * @param {number} y
 * @return {!{r: number, g: number, b: number}}
 */
function readPixel(data, x, y) {
    var position = y * data.width * 3 + x * 3;
    var r = data.rgb.readUInt8(position);
    var g = data.rgb.readUInt8(position + 1);
    var b = data.rgb.readUInt8(position + 2);
    return {r: r, g: g, b: b};
}

/**
 * Use the previous number of clamp the current to the maximum.
 * @param {number} previous
 * @param {number} current
 * @param {number} maximum
 * @returns {number}
 */
function usePreviousOrClamp(previous, current, maximum) {
    if (!isNaN(previous)) return previous;
    if (current > maximum) return maximum;
    return current;
}
