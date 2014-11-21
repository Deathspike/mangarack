'use strict';
var Command = require('commander').Command;

/**
 * Creates options based on the arguments.
 * @param {!Array.<string>} args
 * @return {!Options}
 */
module.exports = function (args) {
    return new Command().version(require('../../package').version)
        // Disables
        .option('-d, --duplication', 'Disable duplication detection.')
        .option('-m, --meta', 'Disable metadata.')
        // Filters
        .option('-c, --chapter <n>', 'The chapter filter.')
        .option('-v, --volume <n>', 'The volume filter.')
        // Settings
        .option('-e, --extension <s>', 'The file extension. (Default: cbz)')
        .option('-o, --output <s>', 'The output directory.')
        .option('-s, --source <s>', 'The source file. (Default: MangaRack.txt)')
        .option('-w, --workers <n>', 'The maximum parallel workers. (# cores)')
        .parse(args);
};
