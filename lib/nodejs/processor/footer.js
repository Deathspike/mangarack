'use strict';
var gm = require('gm');
var Series = require('../../shared/provider/mangafox/series');

/**
 * Runs the processor to crop a black on white textual footer.
 * @implements {IProcessor}
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer=)} done
 */
module.exports = function(buffer, done) {
  _load(buffer, function(err, data) {
    if (err) return done(err);
    var lineCount = _countNumberOfLines(data);
    if (isNaN(lineCount)) return done(undefined, buffer);
    gm(buffer).crop(data.width, data.height - lineCount, 0, 0).toBuffer(done);
  });
};

/**
 * Creates a processor.
 * @param {!IOptions} options
 * @param {!ISeries} series
 * @returns {IProcessor}
 */
module.exports.create = function(options, series) {
  return !options.footer && series instanceof Series ?
    module.exports :
    undefined;
};

/**
 * Count the number of lines to crop.
 * @private
 * @param {!{rgb: !Buffer, height: number, width: number}} data
 * @returns {number}
 */
function _countNumberOfLines(data) {
  var count = NaN;
  var from = NaN;
  var to = NaN;
  for (var ry = 0; ry < 80 && ry < data.height; ry += 1) {
    var channel = _readChannelOrIsBlack(data, data.height - ry - 1);
    if (channel) {
      if (!isNaN(from) && !isNaN(to) && _isWhite(channel)) {
        count = from + to;
      }
    } else {
      if (ry === 0) return NaN;
      from = _usePreviousOrClamp(from, ry, 5);
      to = ry;
    }
  }
  return count;
}

/**
 * Loads the RGB pixel buffer and the dimensions for the buffer.
 * @private
 * @param {!Buffer} buffer
 * @param {function(Error, {rgb: !Buffer, height: number, width: number}=)} done
 */
function _load(buffer, done) {
  var image = gm(buffer);
  image.size(function(err, size) {
    if (err) return done(err);
    image.toBuffer('rgb', function(err, buffer) {
      if (err) return done(err);
      done(undefined, {rgb: buffer, height: size.height, width: size.width});
    });
  });
}

/**
 * Determines if the channel is white.
 * @private
 * @param {!{r: number, g: number, b: number}} channel
 * @returns {boolean}
 */
function _isWhite(channel) {
  return channel.r >= 245 && channel.g >= 245 && channel.b >= 245;
}

/**
 * Returns the channel, or undefined when the line contains black.
 * @private
 * @param {!{rgb: !Buffer, height: number, width: number}} data
 * @param {number} y
 * @returns {{r: number, g: number, b: number}}
 */
function _readChannelOrIsBlack(data, y) {
  var total = {r: 0, g: 0, b: 0};
  for (var x = 0; x < data.width; x += 1) {
    var pixel = _readPixel(data, x, y);
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
 * @private
 * @param {!{rgb: !Buffer, height: number, width: number}} data
 * @param {number} x
 * @param {number} y
 * @returns {!{r: number, g: number, b: number}}
 */
function _readPixel(data, x, y) {
  var position = y * data.width * 3 + x * 3;
  var r = data.rgb.readUInt8(position);
  var g = data.rgb.readUInt8(position + 1);
  var b = data.rgb.readUInt8(position + 2);
  return {r: r, g: g, b: b};
}

/**
 * Use the previous number of clamp the current to the maximum.
 * @private
 * @param {number} previous
 * @param {number} current
 * @param {number} maximum
 * @returns {number}
 */
function _usePreviousOrClamp(previous, current, maximum) {
  if (!isNaN(previous)) return previous;
  if (current > maximum) return maximum;
  return current;
}
