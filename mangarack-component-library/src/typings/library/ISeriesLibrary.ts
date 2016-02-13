import * as mio from '../../default';

/**
 * Represents a series library.
 */
export interface ISeriesLibrary {
  /**
   * Promises the chapter library.
   * @param seriesId The series identifier.
   * @return The promise for the chapter library.
   */
  chaptersAsync(seriesId: number): Promise<mio.IOption<mio.IChapterLibrary>>;

  /**
   * Promises to create the series.
   * @param seriesAddress The series address.
   * @return The promise to create the series.
   */
  createAsync(seriesAddress: string): Promise<mio.IOption<number>>;

  /**
   * Promises to delete the series.
   * @param seriesId The series identifier.
   * @return The promise to delete the series.
   */
  deleteAsync(seriesId: number): Promise<boolean>;

  /**
   * Promises the preview image.
   * @param seriesId The series identifier.
   * @return The promise for the preview image.
   */
  previewImageAsync(seriesId: number): Promise<mio.IOption<mio.IBlob>>;

  /**
   * Promises to update each series.
   * @param enqueueNewChapters If true, enqueues new chapters for download.
   * @return The promise to update each series.
   */
  updateAsync(enqueueNewChapters: boolean): Promise<void>;

  /**
   * Promises a list of series.
   * @return The promise for the list of series.
   */
  viewAsync(): Promise<mio.ISeriesLibraryItem[]>;
}
