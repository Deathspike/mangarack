import * as mio from '../../default';

/**
 * Represents a library chapter.
 */
export interface ILibraryChapter {
  /**
   * Contains the time at which the chapter was added.
   */
  addedAt: number;

  /**
   * Contains the time at which the chapter was found to have been deleted.
   */
  deletedAt: mio.IOption<number>;

  /**
   * Contains the time at which the chapter was downloaded.
   */
  downloadedAt: mio.IOption<number>;

  /**
   * Contains the identifier.
   */
  id: number;

  /**
   * Contains the time at which a page was last read.
   */
  lastReadAt: mio.IOption<number>;

  /**
   * Contains the metadata.
   */
  metadata: mio.IChapterMetadata;

  /**
   * Contains the number of pages.
   */
  numberOfPages: mio.IOption<number>;

  /**
   * Contains the number of read pages.
   */
  numberOfReadPages: number;
}
