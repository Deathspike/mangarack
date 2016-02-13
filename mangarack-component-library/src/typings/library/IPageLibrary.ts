import * as mio from '../../default';

/**
 * Represents a page library.
 */
export interface IPageLibrary {
  /**
   * Promises to download the pages.
   * @return The promise to download the pages.
   */
  downloadAsync(): Promise<void>;

  /**
   * Promises the image.
   * @param pageNumber The page number.
   * @return The promise for the image.
   */
  imageAsync(pageNumber: number): Promise<mio.IOption<mio.IBlob>>;

  /**
   * Promises to set the number of read pages status.
   * @param numberOfReadPages The number of read pages.
   * @return The promise to set the number of read pages status.
   */
  statusAsync(numberOfReadPages: number): Promise<boolean>;
}
