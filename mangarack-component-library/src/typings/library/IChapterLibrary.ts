import * as mio from '../../default';

/**
 * Represents a chapter library.
 */
export interface IChapterLibrary {
  /**
   * Promises to delete the chapter.
   * @param chapterId The chapter identifier.
   * @return The promise to delete the chapter.
   */
  deleteAsync(chapterId: number): Promise<boolean>;

  /**
   * Promises to enqueue a high priority download for the series.
   * @param recursive If true, enqueues low priority downloads for new chapters.
   * @return The promise to enqueue a high priority download for the series.
   */
  downloadAsync(recursive: boolean): Promise<mio.IOption<number>>;

  /**
   * Promises a page library for the chapter.
   * @param chapterId The chapter identifier.
   * @return The promise for the page library for the chapter.
   */
  pagesAsync(chapterId: number): Promise<mio.IOption<mio.IPageLibrary>>;

  /**
   * Promises a list of chapters.
   * @return The promise for the list of chapters.
   */
  viewAsync(): Promise<mio.IChapterLibraryItem[]>;
}
