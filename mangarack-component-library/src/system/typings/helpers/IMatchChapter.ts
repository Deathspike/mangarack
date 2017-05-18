import * as mio from '../../module';

/**
 * Represents a chapter result.
 */
export interface IMatchChapter extends mio.IMatchSeries {
  /**
   * Contains the chapter.
   */
  chapter: mio.IContextChapter;

  /**
   * Contains the chapter metadata derived key.
   */
  chapterMetadataDerivedKey: string;
}
