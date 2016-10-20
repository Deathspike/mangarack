import * as fs from 'fs';
import * as mio from './default';
import * as os from 'os';
import * as path from 'path';
const rootPathKey = 'node.library.rootPath';

/*
 * Starts the process.
 */
(function(): void {
  let rootPath = path.join(os.homedir(), '.mangarack');
  let redirectFilePath = path.join(rootPath, 'redirect.mrx');
  fs.readFile(redirectFilePath, 'utf8', (error, contents) => {
    if (!error && contents) {
      mio.settingService.set(rootPathKey, contents);
      mio.httpService();
    } else {
      mio.settingService.set(rootPathKey, rootPath);
      mio.httpService();
    }
  });
})();
