import * as mio from '../../default';

/**
 * Represents a series library.
 */
export interface ISeriesLibrary {
  /**
   * Promises a chapter library for the series.
   * @param seriesId The series identifier.
   * @return The promise for the chapter library for the series.
   */
  chaptersAsync(seriesId: number): Promise<mio.IOption<mio.IChapterLibrary>>;

  /**
   * Promises to create the series.
   * @param address The address.
   * @param recursive If true, enqueues low priority downloads for new chapters.
   * @return The promise to create the series.
   */
  createAsync(address: string, recursive: boolean): Promise<mio.IOption<number>>;

  /**
   * Promises to delete the series.
   * @param seriesId The series identifier.
   * @return The promise to delete the series.
   */
  deleteAsync(seriesId: number): Promise<boolean>;

  /**
   * Promises to enqueue a normal priority download for the library.
   * @param recursive If true, enqueues low priority downloads for new chapters.
   * @return The promise to enqueue a normal priority download for the library.
   */
  downloadAsync(recursive: boolean): Promise<mio.IOption<number>>;

  /**
   * Promises a list of series.
   * @return The promise for the list of series.
   */
  viewAsync(): Promise<mio.ISeriesLibraryItem[]>;
}
