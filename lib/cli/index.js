'use strict';
var co6 = require('co6');
var fs = co6.promisifyAll(require('fs'));
var os = require('os');
var parse = require('./parse');
var server = require('../server');

/*
 * Run the command line application.
 */
co6.main(function *() {
    var options = parse(process.argv);
    var source = options.source || 'MangaRack.txt';
    var tasks = options.args.length ? args(options) : yield batch(source);
    yield server(tasks, options.workers || os.cpus().length, console.log);
    console.log('Completed!');
});

/**
 * Process the arguments.
 * @param {!Options} options
 * @return {!Array.<!{address: string, !Options}>}
 */
function args(options) {
    var tasks = [];
    options.args.forEach(function (address) {
        tasks.push({address: address, options: options});
    });
    console.log('meh');
    return tasks;
}

/**
 * Process the batch file.
 * @param {string} path
 * @return {!Array.<!{address: string, !Options}>}
 */
function *batch(path) {
    var tasks = [];
    if (!(yield fs.existsAsync(path))) return tasks;
    (yield fs.readFileAsync(path, 'utf8')).split('\n').forEach(function (n) {
        var lineOptions = parse(n.split(' '));
        lineOptions.args.forEach(function (address) {
            tasks.push({address: address, options: lineOptions});
        });
    });
    return tasks;
}
