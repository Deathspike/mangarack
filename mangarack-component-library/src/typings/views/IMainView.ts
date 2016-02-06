import * as mio from '../../default';

/**
 * Represents the main view.
 */
export interface IMainView {
  /**
   * Contains each provider.
   */
  providers: {[name: string]: {
    /**
     * Contains each series.
     */
    series: {[address: string]: {
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
      numberOfChapters: number,

      /**
       * Contains the number of read chapters.
       */
      numberOfReadChapters: number;
    }}
  }};
}
