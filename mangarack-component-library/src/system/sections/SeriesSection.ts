import * as mio from '../module';

/**
 * Represents a series section.
 */
export class SeriesSection implements mio.ISeriesLibrary {
  private _accountId: number;
  private _context: mio.ISeriesLibraryContext;

  /**
   * Initializes a new instance of the SeriesSection class.
   * @param context The context.
   * @param accountId The account identifier.
   */
  constructor(context: mio.ISeriesLibraryContext, accountId: number) {
    this._accountId = accountId;
    this._context = context;
  }

  /**
   * Promises a chapter library for the series.
   * @param seriesId The series identifier.
   * @return The promise for the chapter library for the series.
   */
  chaptersAsync(seriesId: number): Promise<mio.IOption<mio.IChapterLibrary>> {
    throw new Error('TODO: Not implemented');
  }

  /**
   * Promises to create the series.
   * @param address The address.
   * @return The promise to create the series.
   */
  createAsync(address: string): Promise<mio.IOption<number>> {
    throw new Error('TODO: Not implemented');
  }

  /**
   * Promises to delete the series.
   * @param seriesId The series identifier.
   * @return The promise to delete the series.
   */
  deleteAsync(seriesId: number): Promise<boolean> {
    throw new Error('TODO: Not implemented');
  }

  /**
   * Promises to enqueue a high priority download for the library.
   * @param recursive If true, enqueues low priority downloads for new chapters.
   * @return The promise to enqueue a high priority download for the library.
   */
  downloadAsync(recursive: boolean): Promise<mio.IOption<number>> {
    throw new Error('TODO: Not implemented');
  }

  /**
   * Promises a list of series.
   * @return The promise for the list of series.
   */
  viewAsync(): Promise<mio.ISeriesLibraryItem[]> {
    let result: mio.ISeriesLibraryItem[] = [];
    for (let [providerName, provider] of mio.entries(this._context.providers)) {
      for (let [seriesAddress, series] of mio.entries(provider.series)) {
        if (typeof series.numberOfReadChapters[this._accountId] !== 'undefined') {
          result.push({
            addedAt: series.addedAt,
            chapterAddedAt: series.chapterAddedAt,
            checkedAt: series.checkedAt,
            id: series.id,
            metadata: series.metadata,
            numberOfChapters: series.numberOfChapters,
            numberOfReadChapters: series.numberOfReadChapters[this._accountId],
            providerName: providerName,
            seriesAddress: seriesAddress
          });
        }
      }
    }
    return Promise.resolve(result);
  }
}
