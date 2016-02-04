import * as mio from '../../default';

/**
 * Represents a chapter.
 */
export interface IChapter extends mio.IChapterMetadata {
  /**
   * Promises each page.
   * @return The promise for each page.
   */
  pagesAsync: () => Promise<mio.IPage[]>;
}
