var fs = require('fs');
var path = require('path');
var version = process.argv[2];

function isMangarack(key) {
    return /^mangarack/.test(key);
}

fs.readdirSync(__dirname).forEach(function(folderName) {
    if (!isMangarack(folderName)) return;
    var packagePath = path.join(__dirname, folderName, 'package.json');
    var package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (package.dependencies) {
        Object.keys(package.dependencies).forEach(function(dependencyName) {
            if (!isMangarack(dependencyName)) return;
            package.dependencies[dependencyName] = version;
        });
    }
    if (package.devDependencies) {
      Object.keys(package.devDependencies).forEach(function(dependencyName) {
          if (!isMangarack(dependencyName)) return;
          package.devDependencies[dependencyName] = version;
      });
    }
    package.version = version;
    fs.writeFileSync(packagePath, JSON.stringify(package, null, '  ') + '\n');
});
