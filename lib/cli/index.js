'use strict';
var fs = require('fs');
var os = require('os');
var parse = require('./parse');
var server = require('../server');

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
            console.log(data);
        }).on('error', function (err) {
            console.error(err.stack || err);
            process.exit(1);
        }).on('end', function () {
            console.log('Complete!');
        });
    });
})();

/**
 * Initializes the tasks.
 * @param {!Options} options
 * @param {string} path
 * @param {function(Error, Array.<!{address: string, options: !Options})} done
 */
function initialize(options, path, done) {
    if (options.args.length) return process.nextTick(function () {
        done(undefined, options.args.map(function (address) {
            return {address: address, options: options};
        }));
    });
    fs.exists(path, function (exists) {
        if (!exists) return done(undefined, []);
        fs.readFile(path, 'utf8', function (err, data) {
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
