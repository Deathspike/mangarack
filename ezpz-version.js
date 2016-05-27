var fs = require('fs');
var path = require('path');
var version = process.argv[2];

if (version) {
  fs.readdirSync(__dirname).forEach(function(folderName) {
      if (!/^mangarack/.test(folderName)) return;
      var packagePath = path.join(__dirname, folderName, 'package.json');
      var package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      package.version = version;
      fs.writeFileSync(packagePath, JSON.stringify(package, null, '  ') + '\n');
  });
}
