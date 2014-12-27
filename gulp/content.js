'use strict';
var gulp = require('gulp');
var plumber = require('gulp-plumber');

gulp.task('content', function() {
  gulp.src(['src/*', 'src/**/content/**/*', '!src/views'])
    .pipe(plumber())
    .pipe(gulp.dest('build'));
});
