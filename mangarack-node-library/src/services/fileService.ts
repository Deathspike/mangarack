import * as fs from 'fs';
import * as mio from '../default';
import * as path from 'path';

/**
 * Represents a file service.
 * @internal
 */
export let fileService: mio.IFileService = {
  /**
   * Promises to delete the folder resource.
   * @param folderPath The folder path.
   * @return The promise to delete the folder resource.
   */
  deleteFolderAsync: async function(folderPath: string): Promise<void> {
    let resolvedFolderPath = resolveLibraryPath(folderPath);
    await deleteAsync(resolvedFolderPath);
  },

  /**
   * Promises the contents of the file resource.
   * @param filePath The file path.
   * @return The promise for the contents of the file resource.
   */
  readBlobAsync: function(filePath: string): Promise<mio.IOption<mio.IBlob>> {
    return mio.promise<mio.IBlob>(callback => {
      fs.readFile(resolveLibraryPath(filePath), (error, data) => {
        if (error) {
          callback();
        } else {
          callback(undefined, mio.unsafe<mio.IBlob>(data));
        }
      });
    });
  },

  /**
   * Promises the contents of the file resource.
   * @param filePath The file path.
   * @return The promise for the contents of the file resource.
   */
  readObjectAsync: function<T>(filePath: string): Promise<mio.IOption<T>> {
    return mio.promise<T>(callback => {
      fs.readFile(resolveLibraryPath(filePath), 'utf8', (error, data) => {
        if (error) {
          callback();
        } else {
          try {
            callback(undefined, JSON.parse(data));
          } catch (error) {
            callback();
          }
        }
      });
    });
  },

  /**
   * Promises to write the contents to the file resource.
   * @param filePath The file path.
   * @param value The value representing the contents.
   * @return The promise to write the contents to the file resource.
   */
  writeBlobAsync: async function(filePath: string, value: mio.IBlob): Promise<void> {
    let resolvedFilePath = resolveLibraryPath(filePath);
    await createDirectoriesAsync(resolvedFilePath);
    await mio.promise(callback => fs.writeFile(`${resolvedFilePath}.tmp`, value, callback));
    await mio.promise(callback => fs.rename(`${resolvedFilePath}.tmp`, resolvedFilePath, callback));
  },

  /**
   * Promises to write the contents to the file.
   * @param filePath The file path.
   * @param value The value representing the contents.
   * @return The promise to write the contents to the file.
   */
  writeObjectAsync: async function<T>(filePath: string, value: T): Promise<void> {
    let resolvedFilePath = resolveLibraryPath(filePath);
    await createDirectoriesAsync(resolvedFilePath);
    await mio.promise(callback => fs.writeFile(`${resolvedFilePath}.tmp`, JSON.stringify(value), {encoding: 'utf8'}, callback));
    await mio.promise(callback => fs.rename(`${resolvedFilePath}.tmp`, resolvedFilePath, callback));
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
    await mio.promise<void>(callback => fs.mkdir(directoryPath, callback));
  }
}

/**
 * Promises to deletes the file or folder recursively.
 * @param fileOrFolderPath The file or folder path.
 * @return The promise to deletes the file or folder recursively.
 */
async function deleteAsync(fileOrFolderPath: string): Promise<void> {
  let stat = await mio.promise<fs.Stats>(callback => fs.stat(fileOrFolderPath, callback));
  if (stat) {
    if (stat.isFile()) {
      await mio.promise<void>(callback => fs.unlink(fileOrFolderPath, callback));
    } else {
      let relativePaths = await mio.promise<string[]>(callback => fs.readdir(fileOrFolderPath, callback));
      if (relativePaths) {
        for (let relativePath of relativePaths) {
          let absolutePath = path.join(fileOrFolderPath, relativePath);
          await deleteAsync(absolutePath);
        }
        await mio.promise(callback => fs.rmdir(fileOrFolderPath, () => callback()));
      }
    }
  }
}

/**
 * Resolves the library path.
 * @param fileOrFolderPath The file or folder path.
 * @return The resolved library path.
 */
function resolveLibraryPath(fileOrFolderPath: string): string {
  let rootPath = mio.settingService.getString('node.library.rootPath');
  if (rootPath) {
    return path.join(rootPath, fileOrFolderPath);
  } else {
    return fileOrFolderPath;
  }
}
