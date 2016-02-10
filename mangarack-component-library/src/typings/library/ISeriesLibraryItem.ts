import * as mio from '../../default';

/**
 * Represents a series library item.
 */
export interface ISeriesLibraryItem {
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
   * Contains the number of read chapters.
   */
  numberOfReadChapters: number;

  /**
   * Contains the provider name.
   */
  providerName: string;

  /**
   * Contains the series address.
   */
  seriesAddress: string;
}
