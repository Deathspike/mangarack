import * as mio from '../module';

/**
 * Represents a series section.
 */
export class ChapterSection implements mio.IChapterLibrary {
  private _context: mio.IContextSeries;

  /**
   * Initializes a new instance of the ChapterSection class.
   * @param context The context series.
   */
  constructor(context: mio.IContextSeries) {
    this._context = context;
  }

  /**
   * Promises to delete the chapter.
   * @param chapterId The chapter identifier.
   * @return The promise to delete the chapter.
   */
  deleteAsync(chapterId: number): Promise<boolean> {
    throw new Error('TODO: Not implemented');
  }

  /**
   * Promises the page library.
   * @param chapterId The chapter identifier.
   * @return The promise for the page library.
   */
  pagesAsync(chapterId: number): Promise<mio.IOption<mio.IPageLibrary>> {
    throw new Error('TODO: Not implemented');
  }

  /**
   * Promises to update the series.
   * @param enqueueNewChapters If true, enqueues new chapters for download.
   * @return The promise to update the series.
   */
  updateAsync(enqueueNewChapters: boolean): Promise<void> {
    throw new Error('TODO: Not implemented');
  }

  /**
   * Promises a list of chapters.
   * @return The promise for the list of chapters.
   */
  viewAsync(): Promise<mio.IChapterLibraryItem[]> {
    throw new Error('TODO: Not implemented');
  }
}
