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
  .forEach(function(folderName) {
    var directoryPath = path.join(rootPath, folderName);
    childProcess.spawn('node', ['node_modules/typescript/bin/tsc', '-w', '-p', '.'], {cwd: directoryPath, stdio: [0, 1, 2]});
  });
