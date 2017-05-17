var childProcess = require('child_process');

module.exports = function(directoryPath, folderName) {
  if (folderName !== 'mangarack') {
    childProcess.spawn('node', ['node_modules/typescript/bin/tsc', '-w', '-p', '.'], {cwd: directoryPath, stdio: [0, 1, 2]});
  }
};
