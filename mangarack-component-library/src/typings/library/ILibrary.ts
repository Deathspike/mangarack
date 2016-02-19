import * as mio from '../../default';

/**
 * Represents a library. Bound to HTTP, the specifications match:
 *  200 (OK) => Successfully completed the operation. If `+MB`, the response will be included in the `Message Body`.
 *  400 (Bad Request) => Provide the required input variables.
 *  404 (Not Found) => Resource does not exist.
 * And these status responses apply to all calls:
 *  401 (Unauthorized) => Provide the required authentication.
 *  500 (Interal Server Error) => An error occurred.
 */
export interface ILibrary {
  /**
   * [POST /api/library] (200+MB, 400)
   * Promises to create the series.
   * @param seriesAddress The series address.
   * @return The promise to create the series.
   */
  create(): mio.ILibraryHandler<(seriesAddress: string) => mio.IOptionPromise<number>>;

  /**
   * [DELETE /api/library/:seriesId] (200, 404)
   * Promises to delete the series.
   * @param seriesId The series identifier.
   * @return The promise to delete the series.
   */
  deleteAsync(seriesId: number): Promise<boolean>;

  /**
   * [DELETE /api/library/:seriesId/:chapterId] (200, 404)
   * Promises to delete the chapter.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to delete the chapter.
   */
  deleteAsync(seriesId: number, chapterId: number): Promise<boolean>;

  /**
   * [POST /api/download] (200, 400)
   * Promises to download each series metadata.
   * @return The promise to download each series metadata.
   */
  download(): mio.ILibraryHandler<(existingChapters: boolean, newChapters: boolean) => Promise<void>>;

  /**
   * [POST /api/download/:seriesId] (200, 400, 404)
   * Promise to download the series metadata.
   * @param seriesId The series identifier.
   * @return The promise to download the series metadata.
   */
  download(seriesId: number): mio.ILibraryHandler<(existingChapters: boolean, newChapters: boolean) => Promise<boolean>>;

  /**
   * [POST /api/download/:seriesId/:chapterId] (200, 404)
   * Promises to download the chapter.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to download the chapter.
   */
  download(seriesId: number, chapterId: number): mio.ILibraryHandler<() => Promise<boolean>>;

  /**
   * [GET /content/:seriesId] (200+MB, 404)
   * Promises the series image.
   * @param seriesId The series identifier.
   * @return The promise for the series image.
   */
  imageAsync(seriesId: number): mio.IOptionPromise<mio.IBlob>;

  /**
   * [GET /content/:seriesId/:chapterId/:pageNumber] (200+MB, 404)
   * Promises the page image.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @param pageNumber The page number.
   * @return The promise for the page image.
   */
  imageAsync(seriesId: number, chapterId: number, pageNumber: number): mio.IOptionPromise<mio.IBlob>;

  /**
   * [GET /api/library] (200+MB)
   * Promises the list of series.
   * @return The promise for the list of series.
   */
  listAsync(): Promise<mio.ILibrarySeries[]>;

  /**
   * [GET /api/library/:seriesId] (200+MB, 404)
   * Promises the list of chapters.
   * @param seriesId The series identifier.
   * @return The promise for the list of chapters.
   */
  listAsync(seriesId: number): mio.IOptionPromise<mio.ILibraryChapter[]>;

  /**
   * [POST /api] (200, 400)
   * Promises to set the password.
   * @return The promise to set the password.
   */
  password(): mio.ILibraryHandler<(password: string) => Promise<void>>;

  /**
   * [PATCH /api/library/:seriesId/:chapterId] (200, 400, 404)
   * Promises to set the number of read pages status.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @param numberOfReadPages The number of read pages.
   * @return The promise to set the number of read pages status.
   */
  status(seriesId: number, chapterId: number): mio.ILibraryHandler<(numberOfReadPages: number) => Promise<boolean>>;

  /**
   * [GET /api] (200)
   * Promises the version.
   * @return The promise for the version.
   */
  versionAsync(): Promise<{api: number}>;
}
