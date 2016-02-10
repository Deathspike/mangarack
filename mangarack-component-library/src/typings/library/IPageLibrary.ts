import * as mio from '../../default';

/**
 * Represents a page library.
 */
export interface IPageLibrary {
  /**
   * Promises to enqueue a high priority download for the chapter.
   * @return The promise to enqueue a high priority download for the chapter.
   */
  downloadAsync(): Promise<mio.IOption<number>>;

  /**
   * Promises the image.
   * @param pageNumber The page number.
   * @return The promise for the image.
   */
  imageAsync(pageNumber: number): Promise<mio.IOption<mio.IBlob>>;

  /**
   * Promises to update the number of read pages.
   * @param numberOfReadPages The number of read pages.
   * @return The promise to update the number of read pages.
   */
  updateAsync(numberOfReadPages: number): Promise<boolean>;
}
