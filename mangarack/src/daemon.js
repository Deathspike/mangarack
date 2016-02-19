(function() {
  console.log('mangarack-daemon (' + require('../package').version + ')');
  require('source-map-support').install();
  require('mangarack-runnable-daemon/dist/app');
})();
