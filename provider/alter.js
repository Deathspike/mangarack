/*jslint node: true*/
'use strict';

// ==================================================
// Export the function.
// --------------------------------------------------
module.exports = function (children) {
	// Iterate through each child.
	for (var i = 0; i < children.length; i += 1) {
		// Initialize the source.
		var source = children[i];
		// Check if the number is invalid.
		if (isNaN(source.number)) {
			// Initialize the difference.
			var difference;
			// Initialize the differences.
			var differences = {};
			// Initialize the number of differences.
			var numberOfDifferences = 0;
			// Initialize the previous child.
			var previous;
			// Iterate through each child.
			for (var j = 0; j < children.length; j += 1) {
				// Initialize the next child.
				var next = children[j];
				// Check if the next child differs from the source child ...
				if (next !== source &&
					// ... and the next child has an valid number ...
					!isNaN(next.number) &&
					// ... and the next child matches the source volume.
					next.volume === source.volume) {
					// Check if the previous child is available.
					if (previous) {
						// Initialize the difference.
						difference = (next.number - previous.number).toFixed(4);
						// Check if the difference is not defined.
						if (typeof differences[difference] === 'undefined') {
							// Initialize the difference.
							differences[difference] = 1;
							// Initialize the number of differences.
							numberOfDifferences += 1;
						} else {
							// Add the difference.
							differences[difference] += 1;
						}
					}
					// Set the previous child.
					previous = next;
				}
			}
			// Check if differences are available.
			if (numberOfDifferences) {
				// Initialize the best.
				var best;
				// Iterate through each difference.
				for (difference in differences) {
					// Check if the difference is owned.
					if (differences.hasOwnProperty(difference)) {
						// Initialize the count.
						var count = differences[differences];
						// Check if difference exceeds the best.
						if (!best || count > best.count) {
							// Set the best.
							best = {count: count, value: parseFloat(difference)};
						}
					}
				}
				// Set the source number.
				source.number = previous.number;
				// Add the shift to the source number.
				source.number += (Math.min(Math.max(best.value, 0), 1) || 1) / 2;
			} else {
				// Set the source number.
				source.Number = previous ? previous.Number * 1.5 : 0.5;
			}
		}
	}
};