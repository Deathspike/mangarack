'use strict';

/**
 * Exposes the grunt configuration.
 * @param {!Object} grunt
 */
module.exports = function(grunt) {
  // Initialize the configuration.
  grunt.initConfig({
    jscs: {
      main: {options: {config: true}, src: 'Gruntfile.js'},
      lib: {options: {config: true}, src: 'lib/**/*.js'}
    },
    jshint: {
      main: {options: {jshintrc: true}, src: 'Gruntfile.js'},
      lib: {options: {jshintrc: true}, src: 'lib/**/*.js'}
    }
  });

  // Initialize each task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');

  // Register each task.
  grunt.registerTask('lint', ['jshint', 'jscs']);
  grunt.registerTask('default', ['lint']);
};
