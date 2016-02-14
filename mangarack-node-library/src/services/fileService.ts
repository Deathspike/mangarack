'use strict';
import * as mio from '../default';

/**
 * Represents a file service.
 */
export var fileService: mio.IFileService = {
  /**
   * Promises to delete the resource.
   * @param fileOrFolderPath The file or folder path.
   * @return The promise to delete the resource.
   */
  deleteAsync: function(fileOrFolderPath: string): Promise<void> {
    throw new Error('TODO: Not yet implemented.');
  },

  /**
   * Promises the contents of the file resource.
   * @param filePath The file path.
   * @return The promise for the contents of the file.
   */
  readBlobAsync: function(filePath: string): Promise<mio.IOption<mio.IBlob>> {
    throw new Error('TODO: Not yet implemented.');
  },

  /**
   * Promises the contents of the file resource.
   * @param filePath The file path.
   * @return The promise for the contents of the file.
   */
  readObjectAsync: function<T>(filePath: string): Promise<mio.IOption<T>> {
    throw new Error('TODO: Not yet implemented.');
  },

  /**
   * Promises to write the contents to the file.
   * @param filePath The file path.
   * @param value The value representing the contents.
   * @return The promise to write the contents to the file.
   */
  writeBlobAsync: function(filePath: string, value: mio.IBlob): Promise<void> {
    throw new Error('TODO: Not yet implemented.');
  },

  /**
   * Promises to write the contents to the file.
   * @param filePath The file path.
   * @param value The value representing the contents.
   * @return The promise to write the contents to the file.
   */
  writeObjectAsync: function<T>(filePath: string, value: T): Promise<void> {
    throw new Error('TODO: Not yet implemented.');
  }
};
