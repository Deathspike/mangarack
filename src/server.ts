import * as server from './server/';
import * as path from 'path';
export {server}

(function() {
  if (require.main) {
    let mainName = path.basename(require.main.filename);
    if (mainName === 'mangarack-server' || require.main === module) {
      require('source-map-support').install();
      global.Promise = require('bluebird').Promise;
      server.execAsync(process.argv).catch(error => {
        console.error((error && error.stack) || error);
        process.exit(1);
      });
    }
  }
})();
