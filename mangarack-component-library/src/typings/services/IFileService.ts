import * as mio from '../../default';

/**
 * Represents a file service.
 */
export interface IFileService {
  /**
   * Promises to delete the folder resource.
   * @param folderPath The folder path.
   * @return The promise to delete the folder resource.
   */
  deleteFolderAsync: (folderPath: string) => Promise<void>;

  /**
   * Promises the contents of the file resource.
   * @param filePath The file path.
   * @return The promise for the contents of the file resource.
   */
  readBlobAsync: (filePath: string) => Promise<mio.IOption<mio.IBlob>>;

  /**
   * Promises the contents of the file resource.
   * @param filePath The file path.
   * @return The promise for the contents of the file resource.
   */
  readObjectAsync: <T>(filePath: string) => Promise<mio.IOption<T>>;

  /**
   * Promises to write the contents to the file resource.
   * @param filePath The file path.
   * @param value The value representing the contents.
   * @return The promise to write the contents to the file resource.
   */
  writeBlobAsync: (filePath: string, value: mio.IBlob) => Promise<void>;

  /**
   * Promises to write the contents to the file resource.
   * @param filePath The file path.
   * @param value The value representing the contents.
   * @return The promise to write the contents to the file resource.
   */
  writeObjectAsync: <T>(filePath: string, value: T) => Promise<void>;
}
