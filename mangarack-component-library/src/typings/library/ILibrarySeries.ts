import * as mio from '../../default';

/**
 * Represents a library series.
 */
export interface ILibrarySeries {
  /**
   * Contains the time at which the series was added.
   */
  addedAt: number;

  /**
   * Contains the time at which the series was checked.
   */
  checkedAt: number;

  /**
   * Contains the identifier.
   */
  id: number;

  /**
   * Contains the time at which a chapter was last added.
   */
  lastChapterAddedAt?: number;

  /**
   * Contains the time at which a chapter page was last read.
   */
  lastChapterReadAt?: number;

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
