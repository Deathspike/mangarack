import * as mio from '../module';

/**
 * Represents a context series.
 */
export interface IContextSeries {
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

  /**
   * Contains the time at which the series was added for each user.
   */
  users: {[userId: number]: number}
}
