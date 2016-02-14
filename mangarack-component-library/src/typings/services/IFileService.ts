import * as mio from '../../default';

/**
 * Represents a file service.
 */
export interface IFileService {
  /**
   * Promises to delete the resource.
   * @param fileOrFolderPath The file or folder path.
   * @return The promise to delete the resource.
   */
  deleteAsync: (fileOrFolderPath: string) => Promise<void>;

  /**
   * Promises the contents of the file resource.
   * @param filePath The file path.
   * @return The promise for the contents of the file.
   */
  readBlobAsync: (filePath: string) => Promise<mio.IOption<mio.IBlob>>;

  /**
   * Promises the contents of the file resource.
   * @param filePath The file path.
   * @return The promise for the contents of the file.
   */
  readObjectAsync: <T>(filePath: string) => Promise<mio.IOption<T>>;

  /**
   * Promises to write the contents to the file.
   * @param filePath The file path.
   * @param value The value representing the contents.
   * @return The promise to write the contents to the file.
   */
  writeBlobAsync: (filePath: string, value: mio.IBlob) => Promise<void>;

  /**
   * Promises to write the contents to the file.
   * @param filePath The file path.
   * @param value The value representing the contents.
   * @return The promise to write the contents to the file.
   */
  writeObjectAsync: <T>(filePath: string, value: T) => Promise<void>;
}
