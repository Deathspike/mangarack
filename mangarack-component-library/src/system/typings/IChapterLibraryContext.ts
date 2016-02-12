import * as mio from '../module';

/**
 * Represents a chapter library context.
 */
export interface IChapterLibraryContext {
  /**
   * Contains each chapter.
   */
  chapters: {[metadataDerivedKey: string]: mio.IChapterLibraryContextItem};

  /**
   * Contains the next identifier.
   */
  nextId: number;
}
