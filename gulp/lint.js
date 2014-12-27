'use strict';
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var gulp = require('gulp');
var plumber = require('gulp-plumber');

gulp.task('lint', function() {
  gulp.src(['*.js', 'gulp/**/*.js', 'src/**/*.js'])
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs());
});
