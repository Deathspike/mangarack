var childProcess = require('child_process');

module.exports = function(directoryPath, folderName) {
  childProcess.execSync('npm install --silent', {cwd: directoryPath, stdio: [0, 1, 2]});
};
