import * as mio from '../../default';

/**
 * Represents a library.
 */
export interface ILibrary {
  /**
   * [POST /library]
   * Promises to create the series.
   * @param seriesAddress The series address.
   * @return The promise to create the series.
   */
  create(): mio.ILibraryHandler<(seriesAddress: string) => mio.IOptionPromise<number>>;

  /**
   * [DELETE /library/:seriesId]
   * Promises to delete the series.
   * @param seriesId The series identifier.
   * @return The promise to delete the series.
   */
  deleteAsync(seriesId: number): Promise<boolean>;

  /**
   * [DELETE /library/:seriesId/:chapterId]
   * Promises to delete the chapter.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to delete the chapter.
   */
  deleteAsync(seriesId: number, chapterId: number): Promise<boolean>;

  /**
   * [POST /download]
   * Promises to download each series metadata.
   * @return The promise to download each series metadata.
   */
  download(): mio.ILibraryHandler<(existingChapters: boolean, newChapters: boolean) => Promise<void>>;

  /**
   * [POST /download/:seriesId]
   * Promise to download the series metadata.
   * @param seriesId The series identifier.
   * @return The promise to download the series metadata.
   */
  download(seriesId: number): mio.ILibraryHandler<(existingChapters: boolean, newChapters: boolean) => Promise<boolean>>;

  /**
   * [POST /download/:seriesId/:chapterId]
   * Promises to download the chapter.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to download the chapter.
   */
  download(seriesId: number, chapterId: number): mio.ILibraryHandler<() => Promise<boolean>>;

  /**
   * [GET /content/:seriesId]
   * Promises for the series image.
   * @param seriesId The series identifier.
   * @return The promise for the series image.
   */
  imageAsync(seriesId: number): mio.IOptionPromise<mio.IBlob>;

  /**
   * [GET /content/:seriesId/:chapterId/:pageNumber]
   * Promises for the page image.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @param pageNumber The page number.
   * @return The promise for the page image.
   */
  imageAsync(seriesId: number, chapterId: number, pageNumber: number): mio.IOptionPromise<mio.IBlob>;

  /**
   * [GET /library]
   * Promises for the list of series.
   * @return The promise for the list of series.
   */
  listAsync(): Promise<mio.ILibrarySeries[]>;

  /**
   * [GET /library/:seriesId]
   * Promises for the list of series.
   * @param seriesId The series identifier.
   * @return The promise for the list of series.
   */
  listAsync(seriesId: number): mio.IOptionPromise<mio.ILibraryChapter[]>;

  /**
   * [POST /]
   * Promises to set the password.
   * @return The promise to set the password.
   */
  password(): mio.ILibraryHandler<(password: string) => Promise<void>>;

  /**
   * [PATCH /library/:seriesId/:chapterId]
   * Promises to set the number of read pages status.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @param numberOfReadPages The number of read pages.
   * @return The promise to set the number of read pages status.
   */
  status(seriesId: number, chapterId: number): mio.ILibraryHandler<(numberOfReadPages: number) => Promise<boolean>>;
}
