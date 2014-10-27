'use strict';
var Command = require('commander').Command;

/**
 * Create options.
 * @param {!Array.<string>} args
 * @return {!Options}
 */
module.exports = function (args) {
    return new Command().version(require('../../package').version)
        .option('-d, --duplication', 'Disable duplication prevention')
        .option('-e, --extension <s>', 'The file extension. (Default: cbz)')
        .option('-c, --chapter <n>', 'The chapter filter.')
        .option('-v, --volume <n>', 'The volume filter.')
        .option('-s, --source <s>', 'The source file. (MangaRack.txt)')
        .parse(args);
};
