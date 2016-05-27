var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

fs.readdirSync(__dirname)
  .sort()
  .filter(folderName => folderName !== 'mangarack')
  .concat('mangarack')
  .forEach(function(folderName) {
    if (!/^mangarack/.test(folderName)) return;
    var directoryPath = path.join(__dirname, folderName);
    childProcess.execSync('npm install', {cwd: directoryPath, stdio: [0, 1, 2]});
});
