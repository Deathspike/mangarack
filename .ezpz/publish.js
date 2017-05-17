var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

module.exports = function(directoryPath, folderName) {
  var packagePath = path.join(directoryPath, 'package.json');
  var package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (!package.private) {
    childProcess.execSync('npm publish --silent', {cwd: directoryPath, stdio: [0, 1, 2]});
  }
};
