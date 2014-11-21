'use strict';
var fs = require('fs');
var os = require('os');
var parse = require('./parse');
var server = require('../server');
var shared = require('../shared');

/*
 * The main application.
 */
(function () {
    var options = parse(process.argv);
    var path = options.source || 'MangaRack.txt';
    initialize(options, path, function (err, tasks) {
        if (err) return console.error(err);
        var workers = options.workers || os.cpus().length;
        server(tasks, workers).on('data', function (data) {
            console.log(pretty(data));
        }).on('error', function (err) {
            console.error(err.stack || err);
            process.exit(1);
        }).on('end', function (data) {
            console.log('Completed ' + calculate(data.time) + '!');
        });
    });
})();

/**
 * Calculate the hours, minutes and seconds.
 * @param {number} time
 * @return {string}
 */
function calculate(time) {
    var affix = shared.common.affix;
    var secs = affix(Math.round(time / 1000) % 60, 2);
    var mins = affix(Math.round(Math.round(time / 1000) / 60)  % 60, 2);
    var hours = affix(Math.round(Math.round(time / 1000) / 60 / 60), 2);
    return '(' + hours + ':' + mins + ':' + secs + ')';
}

/**
 * Initializes the tasks.
 * @param {!Options} options
 * @param {string} filePath
 * @param {function(Error, Array.<!{address: string, options: !Options})} done
 */
function initialize(options, filePath, done) {
    if (options.args.length) {
        return process.nextTick(function () {
            done(undefined, options.args.map(function (address) {
                return {address: address, options: options};
            }));
        });
    }
    fs.exists(filePath, function (exists) {
        if (!exists) return done(undefined, []);
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) return done(err);
            data.split('\n').forEach(function (line) {
                var lineOptions = parse(line.split(' '));
                done(undefined, lineOptions.args.map(function (address) {
                    return {address: address, options: lineOptions};
                }));
            });
        });
    });
}

/**
 * Prettify the emitted data.
 * @param {item: string, time: ?number, type: string} data
 * @return {string}
 */
function pretty(data) {
    var type = data.type.charAt(0).toUpperCase() + data.type.substr(1);
    var time = data.time ? calculate(data.time) : undefined;
    return type + ' ' + data.item + (time ? ' ' + time : '');
}
