import * as mio from '../../default';

/**
 * Represents a file service.
 */
export interface IFileService {
  /**
   * Promises to delete the file resource.
   * @param filePath The file path.
   * @return The promise to delete the file resource.
   */
  deleteAsync: (filePath: string) => Promise<boolean>;

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
   * Promises the contents of the file resource.
   * @param filePath The file path.
   * @return The promise for the contents of the file.
   */
  readStringAsync: (filePath: string) => Promise<mio.IOption<string>>;

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

  /**
   * Promises to write the contents to the file.
   * @param filePath The file path.
   * @param value The value representing the contents.
   * @return The promise to write the contents to the file.
   */
  writeStringAsync: (filePath: string, value: string) => Promise<void>;
}
