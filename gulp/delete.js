'use strict';
var fs = require('fs');
var gulp = require('gulp');
var path = require('path');

gulp.task('delete', function() {
  try {
    _deleteSync('build');
  } catch (e) {
    console.log(e);
  }
});

/**
 * Deletes the path.
 * @private
 * @param {string} directoryPath
 */
function _deleteSync(directoryPath) {
  if (!fs.existsSync(directoryPath)) return;
  fs.readdirSync(directoryPath).forEach(function(fileName) {
    var filePath = path.join(directoryPath, fileName);
    if (fs.lstatSync(filePath).isDirectory()) return _deleteSync(filePath);
    fs.unlinkSync(filePath);
  });
  fs.rmdirSync(directoryPath);
}
