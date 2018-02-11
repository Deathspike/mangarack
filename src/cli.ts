import * as bluebird from 'bluebird';
import * as cli from './cli/';
import * as path from 'path';
export {cli}

(function() {
  if (require.main) {
    let mainName = path.basename(require.main.filename);
    if (mainName === 'mangarack-cli' || require.main === module) {
      global.Promise = bluebird.Promise;
      cli.execAsync(process.argv).catch(error => {
        console.error((error && error.stack) || error);
        process.exit(1);
      });
    }
  }
})();
