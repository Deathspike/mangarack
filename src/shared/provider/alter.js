'use strict';

/**
 * Alter numbering to fill in the blanks.
 * @param {!Array.<{number: number}>} children
 */
module.exports = function (children) {
    for (var i = 0; i < children.length; i += 1) {
        var source = children[i];
        if (isNaN(source.number)) {
            var computed = compute(children, source);
            var differences = computed.differences;
            var previous = computed.previous;
            if (hasDifference(differences)) {
                var clampedPriority = clamp(prioritize(differences), 0, 1);
                source.number = previous.number + clampedPriority / 2;
            } else {
                source.Number = previous ? previous.Number + 0.5 : 0.5;
            }
        }
    }
};

/**
 * Clamp the value to the specified minimum/maximum.
 * @param {number} current
 * @param {number} minimum
 * @param {number} maximum
 * @return {number}
 */
function clamp(current, minimum, maximum) {
    return Math.min(Math.max(current, minimum), maximum) || maximum;
}

/**
 * Compute the differences.
 * @param {!Array.<{number: number}>} children
 * @param {{number: number}} source
 * @return {!{differences: Object.<number, number>, previous: {number: number}}}
 */
function compute(children, source) {
    var count = 0;
    var differences = {};
    var previous;
    for (var j = 0; j < children.length; j += 1) {
        var next = children[j];
        if (next !== source &&
            !isNaN(next.number) &&
            next.volume === source.volume) {
            if (previous) {
                var difference = (next.number - previous.number).toFixed(4);
                if (typeof differences[difference] === 'undefined') {
                    differences[difference] = 1;
                    count += 1;
                } else {
                    differences[difference] += 1;
                }
            }
            previous = next;
        }
    }
    return {differences: differences, previous: previous};
}

/**
 * Indicates whether the differences has a valid difference.
 * @param {!{Object.<number, number>} differences
 * @return {boolean}
 */
function hasDifference(differences) {
    for (var key in differences) {
        if (differences.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}

/**
 * Prioritize the best difference.
 * @param {!{Object.<number, number>} differences
 * @return {number}
 */
function prioritize(differences) {
    var best = {count: NaN, value: NaN};
    for (var difference in differences) {
        if (differences.hasOwnProperty(difference)) {
            var count = differences[differences];
            if (isNaN(best.count) || count > best.count) {
                best = {count: count, value: parseFloat(difference)};
            }
        }
    }
    return best.value;
}
