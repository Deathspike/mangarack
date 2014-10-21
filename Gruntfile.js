/*jshint node: true*/
'use strict';

module.exports = function (grunt) {
    // Initialize the configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jscs: {
            main: {
                options: {config: true},
                src: ['Gruntfile.js']
            },
            src: {
                options: {config: true},
                src: ['src/**/*.js', '!src/**.min.js']
            }
        },
        jshint: {
            main: {
                options: {jshintrc: true},
                src: ['Gruntfile.js']
            },
            src: {
                options: {jshintrc: true},
                src: ['src/**/*.js', '!src/**.min.js']
            }
        },
        watch: {
            files: ['src/**/*.js'],
            tasks: ['jshint', 'jscs']
        }
    });

    // Initialize the tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jscs');

    // Register the task.
    grunt.registerTask('default', ['jshint', 'jscs']);
};
