'use strict';
var gulp = require('gulp');

gulp.task('watch', ['scripts-watch', 'default'], function() {
  gulp.watch(['src/*', 'src/content/**/*'], ['content']);
  gulp.watch(['src/styles/**/*.less'], ['styles']);
});
