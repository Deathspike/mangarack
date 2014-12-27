'use strict';
var bower = require('../bower');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('bower', function() {
  gulp.src(bower.gulp.copy || [])
    .pipe(plumber())
    .pipe(gulp.dest('build'));
  gulp.src(bower.gulp.scripts || [])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('dep.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/scripts'));
  gulp.src(bower.gulp.styles || [])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('dep.min.css'))
    .pipe(minifyCss({keepSpecialComments: 0}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/styles'));
});
