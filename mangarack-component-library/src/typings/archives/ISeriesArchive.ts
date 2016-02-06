import * as mio from '../../default';

/**
 * Represents the series archive.
 */
export interface ISeriesArchive {
  /**
   * Contains each chapter.
   */
  chapters: {[derivedKey: string]: {
    /**
     * Contains the time at which the chapter was added to the library.
     */
    addedAt: number;

    /**
     * Contains the time at which the chapter was last checked.
     */
    checkedAt: number;

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
     * Contains each user.
     */
    users: {[key: string]: {
      /**
       * Contains the number of read pages.
       */
      numberOfReadPages: number;
    }};
  }};

  /**
   * Contains the next identifier.
   */
  nextId: number;
}
