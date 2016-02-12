import * as mio from '../module';

/**
 * Represents a chapter library context item.
 */
export interface IChapterLibraryContextItem {
  /**
   * Contains the time at which the chapter was added to the library.
   */
  addedAt: number;

  /**
   * Contains the time at which the chapter was found to have been deleted by the provider.
   */
  deletedAt: mio.IOption<number>;

  /**
   * Contains the time at which the chapter was last downloaded.
   */
  downloadedAt: mio.IOption<number>;

  /**
   * Contains the identifier.
   */
  id: number;

  /**
   * Contains the metadata.
   */
  metadata: mio.IChapterMetadata;

  /**
   * Contains the number of pages.
   */
  numberOfPages: number;
  
  /**
   * Contains user-specifc properties.
   */
  users: {[userId: number]: {
    /**
     * Contains the number of read pages.
     */
    numberOfReadPages: number;

    /**
     * Contains the time at which a page was most recently read.
     */
    pageReadAt: number;
  }}
}
