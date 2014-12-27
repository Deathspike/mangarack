'use strict';
var gulp = require('gulp');

gulp.task('default', [
  'bower',
  'modules',
  'content',
  'scripts',
  'styles'
]);
