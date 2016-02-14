import * as mio from '../module';

/**
 * Represents a context chapter result.
 */
export interface IFindContextChapterResult extends mio.IFindContextSeriesResult {
  /**
   * Contains the chapter.
   */
  chapter: mio.IContextChapter;

  /**
   * Contains the chapter metadata derived key.
   */
  chapterMetadataDerivedKey: string;
}
