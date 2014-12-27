'use strict';
var less = require('gulp-less');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('styles', function() {
  gulp.src('src/styles/app.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less({compress: true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/styles'));
});
