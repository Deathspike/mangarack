'use strict';
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var data = require('../package');

gulp.task('modules', function() {
  var modules = Object.keys(data.dependencies).join('|');
  gulp.src(['*node_modules/+(' + modules + ')/**/*'])
    .pipe(plumber())
    .pipe(gulp.dest('build'));
});
