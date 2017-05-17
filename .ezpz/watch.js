var childProcess = require('child_process');
var readline = require('readline');
var totalCompiling = 0;

module.exports = function(directoryPath, folderName) {
  if (folderName !== 'mangarack') {
    var tsc = childProcess.spawn('node', ['node_modules/typescript/bin/tsc', '-w', '-p', '.'], {cwd: directoryPath});
    var rl = readline.createInterface({input: tsc.stdout});
    rl.on('line', processLine);
    totalCompiling++;
  }
};

function processLine(line) {
  switch (true) {
    case /Compilation complete/.test(line):
      if (--totalCompiling == 0) console.log(line);
      break;
    case /File change detected/.test(line):
      if (totalCompiling++ == 0) console.log(line);
      break;
    default:
      console.log(line);
      break;
  }
}
