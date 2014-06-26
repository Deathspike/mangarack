/*jslint node: true*/
'use strict';
// Initialize the clamp function.
var clamp;
// Initialize the compute function.
var compute;
// Initialize the prioritize function.
var prioritize;

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
			// Initialize the computed differences.
			var computed = compute(children, source);
			// Initialize the previous.
			var previous = computed.previous;
			// Check if differences are available.
			if (computed.count) {
				// Initialize the clamped priority.
				var clampedPriority = clamp(prioritize(computed), 0, 1);
				// Set the source number.
				source.number = previous.number + clampedPriority / 2;
			} else {
				// Set the source number.
				source.Number = previous ? previous.Number + 0.5 : 0.5;
			}
		}
	}
};

// ==================================================
// Clamp the value to the specified minimum/maximum.
// --------------------------------------------------
clamp = function (current, minimum, maximum) {
	// Clamp the value to the specified minimum/maximum.
	return Math.min(Math.max(current, minimum), maximum) || maximum;
};

// ==================================================
// Compute the differences.
// --------------------------------------------------
compute = function (children, source) {
	// Initialize the count.
	var count = 0;
	// Initialize the difference.
	var difference;
	// Initialize the differences.
	var differences = {};
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
					// Increment the count.
					count += 1;
				} else {
					// Add the difference.
					differences[difference] += 1;
				}
			}
			// Set the previous child.
			previous = next;
		}
	}
	// Return the result.
	return {count: count, differences: differences, previous: previous};
};

// ==================================================
// Prioritize the best difference.
// --------------------------------------------------
prioritize = function (computed) {
	// Initialize the best.
	var best = {count: NaN, value: NaN};
	// Iterate through each difference.
	for (var difference in computed.differences) {
		// Check if the difference is owned.
		if (computed.differences.hasOwnProperty(difference)) {
			// Initialize the count.
			var count = computed.differences[computed.differences];
			// Check if difference exceeds the best.
			if (isNaN(best.count) || count > best.count) {
				// Set the best.
				best = {count: count, value: parseFloat(difference)};
			}
		}
	}
	// Return the best value.
	return best.value;
};