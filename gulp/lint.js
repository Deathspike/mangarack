'use strict';
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var gulp = require('gulp');

gulp.task('lint', function() {
  gulp.src(['*.js', 'gulp/**/*.js', 'lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jscs());
});
