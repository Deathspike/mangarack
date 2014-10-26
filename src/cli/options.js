'use strict';
var commander = require('commander');

/**
 * Create options.
 * @return {!Options}
 */
module.exports = function () {
    return new commander.Command().version(require('../../package').version)
        .option('-d, --duplication', 'Disable duplication prevention')
        .option('-e, --extension <s>', 'The file extension. (Default: cbz)')
        .option('-c, --chapter <n>', 'The chapter filter.')
        .option('-v, --volume <n>', 'The volume filter.')
        .option('-s, --source <s>', 'The source file. (MangaRack.txt)');
};
