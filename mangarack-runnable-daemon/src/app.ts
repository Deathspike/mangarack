import * as fs from 'fs';
import * as mio from './default';
import * as os from 'os';
import * as path from 'path';
let storeService = mio.dependency.get<mio.IStoreService>('IStoreService');

/*
 * Starts the process.
 */
(function() {
  let rootPath = path.join(os.homedir(), '.mangarack');
  let rootPathKey = 'node.library.rootPath';
  let redirectFilePath = path.join(rootPath, 'redirect.mrx');
  fs.readFile(redirectFilePath, 'utf8', (error, contents) => {
    if (!error && contents) {
      storeService().set(rootPathKey, contents);
      mio.startHttp();
    } else {
      storeService().set(rootPathKey, rootPath);
      mio.startHttp();
    }
  });
})();
