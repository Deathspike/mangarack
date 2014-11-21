'use strict';
var available;
var footer = require('./footer');
var exec = require('child_process').exec;
var processors = [footer];

/**
 * Creates an array of processors for the task.
 * @param {!Options}
 * @param {!Series} series
 * @param {!Chapter} chapter
 * @param {function(Error, Array.<!Processor>)} done
 */
module.exports = function (options, series, chapter, done) {
    check(function (err, available) {
        if (err || !available) return done(err, err ? undefined : []);
        done(undefined, processors.filter(function (processor) {
            return processor.check(options, series, chapter);
        }));
    });
};

/**
 * Adds a processor.
 * @param {!Provider} provider
 */
module.exports.push = function (processor) {
    processors.push(processor);
};

/**
 * Determines whether the module is available.
 * @param {function(Error, ?boolean}) done
 */
function check(done) {
    if (typeof available !== 'undefined') {
        return process.nextTick(function () {
            done(undefined, available);
        });
    }
    exec('gm', function (err, stdout) {
        available = Boolean(stdout);
        done(undefined, available);
    });
}
