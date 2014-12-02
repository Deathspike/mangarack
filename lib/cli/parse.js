'use strict';
var Command = require('commander').Command;

/**
 * Parses options based on the arguments.
 * @param {!Array.<string>} args
 * @return {!IOptions}
 */
module.exports = function(args) {
  return new Command().version(require('../../package').version)
    // Disables
    .option('-a, --animation', 'Disable image animation framing.')
    .option('-d, --duplication', 'Disable duplication detection.')
    .option('-f, --footer', 'Disable image footer cropping (MangaFox).')
    .option('-m, --meta', 'Disable metadata.')
    .option('-n, --normalize', 'Disable image normalization.')
    // Filters
    .option('-c, --chapter <n>', 'The chapter filter.')
    .option('-v, --volume <n>', 'The volume filter.')
    // Settings
    .option('-e, --extension <s>', 'The file extension. (Default: cbz)')
    .option('-o, --output <s>', 'The output directory.')
    .option('-s, --source <s>', 'The source file. (Default: MangaRack.txt)')
    .option('-t, --transform <s>', 'The image transformation output.')
    .option('-w, --workers <n>', 'The maximum workers. (Default: # cores)')
    .parse(args);
};
