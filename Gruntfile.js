'use strict';

module.exports = function (grunt) {
    // Initialize the configuration.
    grunt.initConfig({
        jscs: {
            main: {options: {config: true}, src: 'Gruntfile.js'},
            src: {options: {config: true}, src: 'src/**/*.js'}
        },
        jshint: {
            main: {options: {jshintrc: true}, src: 'Gruntfile.js'},
            src: {options: {jshintrc: true}, src: 'src/**/*.js'}
        }
    });

    // Initialize the tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

    // Register the task.
    grunt.registerTask('default', ['jshint', 'jscs']);
};
