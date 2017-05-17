var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var rootPath = path.join(__dirname, '..');

if (path.basename(rootPath) !== 'node_modules') {
  console.log('ERROR: The containing folder must be named \'node_modules\'.');
  process.exit(1);
}

fs.readdirSync(rootPath)
  .sort()
  .filter(folderName => /^mangarack-/.test(folderName))
  .concat('mangarack')
  .forEach(function(folderName) {
    var packagePath = path.join(rootPath, folderName, 'package.json');
    var package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (!package.private) {
      var directoryPath = path.join(rootPath, folderName);
      childProcess.execSync('npm publish', {cwd: directoryPath, stdio: [0, 1, 2]});
    }
  });
