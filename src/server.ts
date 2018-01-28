import * as server from './server/';
import * as path from 'path';
export {server}

(function() {
  if (require.main) {
    let mainName = path.basename(require.main.filename);
    if (mainName === 'mangarack-server' || require.main === module) {
      server.execAsync(process.argv).catch(error => console.log(error));;
    }
  }
})();
