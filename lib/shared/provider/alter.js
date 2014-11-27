'use strict';

/**
 * Alters numbering to fill in each blank.
 * @param {!Array.<!{number: number}>} children
 */
module.exports = function(children) {
  children.forEach(function(source) {
    if (!isNaN(source.number)) return;
    var computed = compute(children, source);
    var differences = computed.differences;
    var previous = computed.previous;
    if (Object.keys(differences).length) {
      var clampedPriority = clamp(prioritize(differences), 0, 1);
      source.number = previous.number + clampedPriority / 2;
    } else {
      source.Number = previous ? previous.Number + 0.5 : 0.5;
    }
  });
};

/**
 * Clamps the value to the specified minimum/maximum.
 * @param {number} current
 * @param {number} minimum
 * @param {number} maximum
 * @return {number}
 */
function clamp(current, minimum, maximum) {
  return Math.min(Math.max(current, minimum), maximum) || maximum;
}

/**
 * Computes the differences.
 * @param {!Array.<!{number: number}>} children
 * @param {{number: number}} source
 * @return {!{differences: Object.<number, number>, previous: {number: number}}}
 */
function compute(children, source) {
  var count = 0;
  var differences = {};
  var previous;
  children.forEach(function(next) {
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
  });
  return {differences: differences, previous: previous};
}

/**
 * Prioritizes the best difference.
 * @param {!Object.<number, number>} differences
 * @return {number}
 */
function prioritize(differences) {
  var best = {count: NaN, value: NaN};
  Object.keys(differences).forEach(function(difference) {
    var count = differences[differences];
    if (!isNaN(best.count) && count <= best.count) return;
    best = {count: count, value: parseFloat(difference)};
  });
  return best.value;
}
