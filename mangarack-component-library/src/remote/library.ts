import * as mio from './module';
let httpService = mio.dependency.get<mio.IHttpService>('IHttpService');

/**
 * Represents a remote library.
 */
export class RemoteLibrary implements mio.ILibrary {
  private _address: string;

  /**
   * Initializes a new instance of the RemoteLibrary class.
   * @param host The host.
   */
  constructor(host: mio.IOption<string>) {
    this._address = host.hasValue ? `http://${host}` : '';
  }

  /**
   * Promises to create the series.
   * @return The promise to create the series.
   */
  create(): mio.ILibraryHandler<(seriesAddress: string) => mio.IOptionPromise<number>> {
    throw new Error('TODO: Not yet implemented.');
    /*return mio.createHandler(async (seriesAddress: string) => {
      try {
        return await httpService().postObjectAsync<number>(`${this._address}/api/library`, {seriesAddress});
      } catch (error) {
        return mio.option<number>();
      }
    });*/
  }

  /**
   * Promises to delete the series/chapter.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter= identifier.
   * @return The promise to delete the series/chapter.
   */
  async deleteAsync(seriesId: number, chapterId?: number): Promise<boolean> {
    if (chapterId == null) {
      throw new Error('TODO: Not yet implemented.');
    } else {
      throw new Error('TODO: Not yet implemented.');
    }
  }

  /**
   * Promises to download each `series metadata/the series metadata/the chapter`.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to download each `series metadata/the series metadata/the chapter`.
   */
  download(seriesId?: number, chapterId?: number): mio.ILibraryHandler<any> {
    if (seriesId == null && chapterId == null) {
      throw new Error('TODO: Not yet implemented.');
    } else if (chapterId == null) {
      throw new Error('TODO: Not yet implemented.');
    } else {
      throw new Error('TODO: Not yet implemented.');
    }
  }

  /**
   * Promises the series/page image.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter identifier.
   * @param pageNumber= The page number.
   * @return The promise for the series/page image.
   */
  imageAsync(seriesId: number, chapterId?: number, pageNumber?: number): mio.IOptionPromise<mio.IBlob> {
    if (chapterId == null || pageNumber == null) {
      throw new Error('TODO: Not yet implemented.');
    } else {
      throw new Error('TODO: Not yet implemented.');
    }
  }

  /**
   * Promises the list of series/chapters.
   * @param seriesId The series identifier.
   * @return The promise for the list of series/chapters.
   */
  async listAsync(seriesId?: number): Promise<any> {
    if (seriesId == null) {
      throw new Error('TODO: Not yet implemented.');
    } else {
      throw new Error('TODO: Not yet implemented.');
    }
  }

  /**
   * Promises to set the password.
   * @return The promise to set the password.
   */
  password(): mio.ILibraryHandler<(password: string) => Promise<void>> {
    throw new Error('TODO: Not yet implemented.');
  }

  /**
   * Promises to propagate and archive the setting.
   * @param settings The settings.
   * @return The promise to propagate and archive the setting.
   */
  setting(): mio.ILibraryHandler<(key: string, value: string) => Promise<void>> {
    throw new Error('TODO: Not yet implemented.');
  }

  /**
   * Promises to set the number of read pages status.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to set the number of read pages status.
   */
  status(seriesId: number, chapterId: number): mio.ILibraryHandler<(numberOfReadPages: number) => Promise<boolean>> {
    throw new Error('TODO: Not yet implemented.');
  }

  /**
   * Promises the version.
   * @return The promise for the version.
   */
  versionAsync(): Promise<{api: number}> {
    throw new Error('TODO: Not yet implemented.');
  }
}
