import * as archiver from 'archiver';
import * as fs from 'fs';
import * as mio from '../default';
import * as path from 'path';

/**
 * Represents the zip service.
 */
export let zipService = {
  /**
   * Creates the zip archive.
   * @param filePath The file path.
   * @return The zip archive.
   */
  create: function(filePath: string): {commitAsync: () => Promise<void>, writeAsync: (fileName: string, data: any) => Promise<void>} {
    // Initialize the variables.
    let archive = archiver.create('zip', {store: true});
    let isWriting = false;
    let tempFilePath = `${filePath}.mrtmp`;

    // Returns the zip archive.
    return {
      /**
       * Promises to commit the archive.
       * @return The promise to commit the archive.
       */
      commitAsync: async function(): Promise<void> {
        if (isWriting) {
          archive.finalize();
          await mio.promise<void>(callback => fs.rename(tempFilePath, filePath, callback));
        }
      },

      /**
       * Promises to write the file.
       * @param fileName The file name.
       * @param data The data.
       * @return The promise to write the file.
       */
      writeAsync: async function(fileName: string, data: any): Promise<void> {
        if (!isWriting) {
          await createDirectoriesAsync(tempFilePath);
          archive.pipe(fs.createWriteStream(tempFilePath));
          isWriting = true;
        }
        archive.append(data, {name: fileName});
      }
    };
  }
};

/**
 * Promises to create each directory to contain the file.
 * @param filePath The file path.
 * @return The promise for the creation of each directory to contain the file.
 */
async function createDirectoriesAsync(filePath: string): Promise<void> {
  let directoryPaths: string[] = [];
  let previousPath = path.resolve(filePath);
  while (true) {
    let currentPath = path.join(previousPath, '..');
    if (currentPath !== previousPath) {
      directoryPaths.push(currentPath);
      previousPath = currentPath;
    } else {
      break;
    }
  }
  for (let directoryPath of directoryPaths.reverse()) {
    await mio.promise<void>(callback => fs.mkdir(directoryPath, error => callback()));
  }
}
