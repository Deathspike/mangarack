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
   * Promises the page library.
   * @param chapterId The chapter identifier.
   * @return The promise for the page library.
   */
  pagesAsync(chapterId: number): Promise<mio.IOption<mio.IPageLibrary>>;

  /**
   * Promises to update the series.
   * @param enqueueNewChapters If true, enqueues new chapters for download.
   * @return The promise to update the series.
   */
  updateAsync(enqueueNewChapters: boolean): Promise<void>;

  /**
   * Promises a list of chapters.
   * @return The promise for the list of chapters.
   */
  viewAsync(): Promise<mio.IChapterLibraryItem[]>;
}
