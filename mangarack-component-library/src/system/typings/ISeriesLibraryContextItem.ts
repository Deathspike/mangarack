import * as mio from '../module';

/**
 * Represents a series library context item.
 */
export interface ISeriesLibraryContextItem {
  /**
   * Contains the time at which the series was added to the library.
   */
  addedAt: number;

  /**
   * Contains the time at which the most recent chapter was added to the library.
   */
  chapterAddedAt: number;

  /**
   * Contains the time at which the series was last checked.
   */
  checkedAt: number;

  /**
   * Contains the identifier.
   */
  id: number;

  /**
   * Contains the metadata.
   */
  metadata: mio.ISeriesMetadata;

  /**
   * Contains the number of chapters.
   */
  numberOfChapters: number;

  /**
   * Contains user-specifc properties.
   */
  users: {[userId: number]: {
    /**
     * Contains the time at which a chapter was most recently read.
     */
    chapterReadAt: number;

    /**
     * Contains the number of read chapters.
     */
    numberOfReadChapters: number;
  }}
}
