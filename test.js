'use strict';
var gm = require('gm');



var getPixel = function (image, x, y) {
	// Initialize the pixel position in the buffer.
	var position = y * image.width * 3 + x * 3;
	// Initialize the red color.
	var r = image.buffer.readUInt8(position);
	// Initialize the green color.
	var g = image.buffer.readUInt8(position + 1);
	// Initialize the blue color.
	var b = image.buffer.readUInt8(position + 2);
	// Return the pixel.
	return {r: r, g: g, b: b};
};

var getChannel = function (image, y) {
	// Initialize the line.
	var total = {r: 0, g: 0, b: 0};
	// Iterate through each pixel on the line.
	for (var x = 0; x < image.width; x += 1) {
		// Initialize the pixel
		var pixel = getPixel(image, x, y);
		// Check if the pixel is not considered to be black.
		if (pixel.r >= 45 && pixel.g >= 45 && pixel.b >= 45) {
			// Add the red color to the line.
			total.r += pixel.r;
			// Add the green color to the line.
			total.g += pixel.g;
			// Add the blue color to the line.
			total.b += pixel.b;
		} else {
			// Return undefined.
			return undefined;
		}
	}
	// Return the line ...
	return {
		// ... with the red color average ...
		r: Math.round(total.r / image.width),
		// ... with the green color average ...
		g: Math.round(total.g / image.width),
		// ... with the blue color average.
		b: Math.round(total.b / image.width)
	};
};


var make = function (input) {
	return new Promise(function (resolve, reject) {
		var image = {};
		gm(input).setFormat('rgb').size(function (err, size) {
			if (err) {
				reject(err);
				return;
			}
			image.height = size.height;
			image.width = size.width;
		})
		.toBuffer(function (err, buffer) {
			if (err) {
				reject(err);
				return;
			}
			image.buffer = buffer;
			resolve(image);
		});
	});
};


make('test.jpg').then(function (image) {
	// Initialize the crop line.
	var cropLine = NaN;
	// Initialize the first invalid line.
	var firstBlack = NaN;
	// Initialize the previous invalid line.
	var previousBlack = NaN;
	
	// Iterate through each line until the maximum incision height.
	for (var line = 0; line < 80 && line < image.height; line += 1) {
		// Initialize the channel.
		var channel = getChannel(image, image.height - line - 1);
		// Check if the channel is considered to be black.
		if (!channel) {
			if (isNaN(firstBlack) && (firstBlack = line > 5 ? 5 : line) === 0) {
				break;
			}
			previousBlack = line;
		} else if (!isNaN(firstBlack) && !isNaN(previousBlack)) {
			
			if (channel.r >= 245 && channel.g >= 245 && channel.b >= 245) {
				cropLine = firstBlack + previousBlack;
			}
		}
	}
	
	if (!isNaN(cropLine)){
		gm('test.jpg')
		.crop(image.width, image.height - cropLine, 0, 0)
		.write('test_out.jpg', function () {
		});
	}
});