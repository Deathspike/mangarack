var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

function isMangarack(key) {
    return /^mangarack/.test(key);
}

fs.readdirSync(__dirname).forEach(function(folderName) {
    if (!isMangarack(folderName)) return;
    var packagePath = path.join(__dirname, folderName, 'package.json');
    var package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (!package.private) {
      var directoryPath = path.join(__dirname, folderName);
      childProcess.execSync('npm publish', {cwd: fullPath, stdio: [0, 1, 2]});
    }
});
