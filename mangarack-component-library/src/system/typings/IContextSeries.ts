import * as mio from '../module';

/**
 * Represents a context series.
 */
export interface IContextSeries {
  /**
   * Contains the time at which the series was added.
   */
  addedAt: number;

  /**
   * Contains each chapter.
   */
  chapters: {[metadataDerivedKey: string]: mio.IContextChapter};

  /**
   * Contains the time at which the series was checked.
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
}
