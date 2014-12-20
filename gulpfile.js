'use strict';
var fs = require('fs');
var path = require('path');

/**
 * Loads the tasks.
 * @private
 * @param {string} directoryPath
 */
(function _loadTasks(directoryPath) {
  fs.readdirSync(directoryPath).forEach(function(fileName) {
    var filePath = './' + path.join(directoryPath, fileName);
    if (!/\./.test(fileName)) return _loadTasks(filePath);
    if (/\.js$/.test(fileName)) return require(filePath);
  });
})('gulp');
