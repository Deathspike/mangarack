'use strict';

module.exports = function (grunt) {
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

    grunt.loadNpmTasks('grunt-contrib-jscs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'jscs']);
};
