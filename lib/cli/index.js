'use strict';
var affix = require('../shared').common.affix;
var fs = require('fs');
var os = require('os');
var parse = require('./parse');
var server = require('../server');

/*
 * The main application.
 */
(function() {
  var options = parse(process.argv);
  initialize(options, options.source || 'MangaRack.txt', function(err, tasks) {
    if (err) return console.error(err);
    var maximum = options.workers || os.cpus().length;
    server(tasks, maximum).on('data', function(data) {
      console.log(pretty(data));
    }).on('error', function(err) {
      console.error(err.stack || err);
      process.exit(1);
    }).on('end', function(data) {
      console.log('Completed ' + calculate(data.timeInMs) + '!');
    });
  });
})();

/**
 * Calculate the hours, minutes and seconds.
 * @param {number} timeInMs
 * @return {string}
 */
function calculate(timeInMs) {
  var seconds = affix(Math.floor(timeInMs / 1000) % 60, 2);
  var minutes = affix(Math.floor(timeInMs / 1000 / 60) % 60, 2);
  var hours = affix(Math.floor(timeInMs / 1000 / 60 / 60), 2);
  return '(' + hours + ':' + minutes + ':' + seconds + ')';
}

/**
 * Initializes the tasks.
 * @param {!IOptions} options
 * @param {string} filePath
 * @param {function(Error, Array.<!{address: string, options: !IOptions}>)} done
 */
function initialize(options, filePath, done) {
  if (options.args.length) {
    return process.nextTick(function() {
      done(undefined, options.args.map(function(address) {
        return {address: address, options: options};
      }));
    });
  }
  fs.exists(filePath, function(exists) {
    if (!exists) return done(undefined, []);
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) return done(err);
      var map = [];
      data.split('\n').forEach(function(line) {
        var lineOptions = parse(process.argv.concat(line.split('\n')));
        lineOptions.args.forEach(function(address) {
          if (!address) return;
          map.push({address: address, options: lineOptions});
        });
      });
      done(undefined, map);
    });
  });
}

/**
 * Prettify the emitted data.
 * @param {!{item: string, timeInMs: ?number, type: string}} data
 * @return {string}
 */
function pretty(data) {
  var type = data.type.charAt(0).toUpperCase() + data.type.substr(1);
  var time = data.timeInMs ? ' ' + calculate(data.timeInMs) : '';
  return type + ' ' + data.item + time;
}
