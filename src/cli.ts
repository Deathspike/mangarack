import * as cli from './cli/';
import * as path from 'path';
export {cli}

(function() {
  if (require.main) {
    let mainName = path.basename(require.main.filename);
    if (mainName === 'mangarack-cli' || require.main === module) {
      cli.execAsync(process.argv).catch(error => {
        console.error(error);
        process.exit(1);
      });
    }
  }
})();
