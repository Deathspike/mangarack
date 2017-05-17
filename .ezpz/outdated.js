var childProcess = require('child_process');

module.exports = function(directoryPath, folderName) {
  childProcess.execSync('npm outdated --depth 0', {cwd: directoryPath, stdio: [0, 1, 2]});
};
