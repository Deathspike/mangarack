(function() {
  var fs = require('fs');
  var readFileSync = fs.readFileSync;
  fs.readFileSync = function(file, options) {
    return /(\/|\\)gm(\/|\\)package.json$/.test(file) ? '{"version": "1.0.0"}' : readFileSync.call(fs, file, options);
  };
})();

(function() {
  console.log('mangarack-cli (' + require('../package').version + ')');
  require('source-map-support').install();
  require('mangarack-runnable-cli/dist/app');
})();
