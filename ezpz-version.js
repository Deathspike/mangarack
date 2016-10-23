var fs = require('fs');
var path = require('path');
var version = process.argv[2];

if (!version) {
  console.log('ERROR: A new version must be provided.');
  process.exit(1);
}

fs.readdirSync(__dirname)
  .filter(folderName => /^mangarack/.test(folderName))
  .forEach(function(folderName) {
    var packagePath = path.join(__dirname, folderName, 'package.json');
    var package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    package.version = version;
    fs.writeFileSync(packagePath, JSON.stringify(package, null, '  ') + '\n');
  });
