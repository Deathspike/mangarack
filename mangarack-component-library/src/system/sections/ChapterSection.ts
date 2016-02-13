import * as mio from '../module';
let fileService = mio.dependency.get<mio.IFileService>('IFileService');

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
  async deleteAsync(chapterId: number): Promise<boolean> {
    let match = mio.find(this._context.chapters, chapter => chapter.id === chapterId);
    if (match.value != null) {
      match.value[1].downloadedAt = mio.option<number>();
      await fileService().deleteAsync(mio.pathOfChapter(this._context.id, chapterId));
      await mio.contextService.writeContext();
      return true;
    } else {
      return false;
    }
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
    // Also get the preview image of the series.
    throw new Error('TODO: Not implemented');
  }

  /**
   * Promises a list of chapters.
   * @return The promise for the list of chapters.
   */
  viewAsync(): Promise<mio.IChapterLibraryItem[]> {
    return Promise.resolve(mio.mapArray(this._context.chapters, chapter => chapter));
  }
}
