'use strict';
var brfs = require('brfs-htmlmin');
var browserify = require('browserify');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

_createTaskAndWatcher('scripts', 'src/scripts/app.js', 'build/scripts');

/**
 * Creates a script task and watcher task for the source path.
 * @private
 * @param {string} taskName
 * @param {string} sourcePath
 * @param {string} destinationPath
 */
function _createTaskAndWatcher(taskName, sourcePath, destinationPath) {
  var bundler = browserify({
    builtins: [],
    cache: {},
    debug: true,
    entries: ['./' + sourcePath],
    fullPaths: true,
    packageCache: {},
    transform: [brfs]
  });
  gulp.task(taskName, function() {
    gulp.src(sourcePath)
      .pipe(plumber())
      .pipe(transform(function() {
        return bundler.bundle();
      }))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(destinationPath));
  });
  gulp.task(taskName + '-watch', function() {
    bundler = watchify(bundler, {delay: -1}).on('update', function() {
      gulp.start(taskName);
    });
  });
}
