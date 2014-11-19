'use strict';

module.exports = function (grunt) {
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

    // Initialize the tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

    // Register the task.
    grunt.registerTask('default', ['jshint', 'jscs']);
};
