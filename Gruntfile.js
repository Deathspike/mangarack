// Enable restricted mode.
'use strict';
// Initialize the options.
var options;

// ==================================================
// Export the function.
// --------------------------------------------------
module.exports = function (grunt) {
    // Add the package information to the options.
    options.pkg = grunt.file.readJSON('package.json');
    // Load the options.
    grunt.initConfig(options);

    // Load the jscs task.
    grunt.loadNpmTasks('grunt-jscs-checker');
    // Load the jshint task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // Load the watch task.
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Register each default task.
    grunt.registerTask('default', ['jshint', 'jscs']);
};

// ==================================================
// Initialize the options.
// --------------------------------------------------
options = {
    // Add the jscs grunt ...
    jscs: {
         // ... with the main task ...
        main: {options: {config: true}, src: ['Gruntfile.js']},
         // ... with the source task.
        src: {options: {config: true}, src: ['src/**/*.js', '!src/**.min.js']}
    },
   // Add the jshint grunt ...
    jshint: {
        // ... with the main task ...
        main: {options: {jshintrc: true}, src: ['Gruntfile.js']},
        // ... with the source task.
        src: {options: {jshintrc: true}, src: ['src/**/*.js', '!src/**.min.js']}
    },
    // Add the watch grunt ...
    watch: {
        // ... with the files ...
        files: ['src/**/*.js'],
        // ... with the tasks.
        tasks: ['jshint', 'jscs']
    }
};
