var fs = require('fs');
var path = require('path');

if (path.basename(__dirname) !== 'node_modules') {
  console.log('ERROR: The containing folder must be named \'node_modules\'.');
  process.exit(1);
}

fs.readdirSync(__dirname)
  .sort()
  .filter(folderName => /^mangarack-/.test(folderName))
  .concat('mangarack')
  .forEach(function(folderName) {
    var directoryPath = path.join(__dirname, folderName);
    require('./.ezpz/' + process.argv[2])(directoryPath, folderName);
  });
