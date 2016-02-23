import * as mio from './module';
let httpService = mio.dependency.get<mio.IHttpService>('IHttpService');

/**
 * Represents a remote library.
 * @internal
 */
export class RemoteLibrary implements mio.ILibrary {
  private _address: string;
  private _authorization: string;

  /**
   * Initializes a new instance of the RemoteLibrary class.
   * @param host The host.
   * @param password The password.
   */
  constructor(host: mio.IOption<string>, password: mio.IOption<string>) {
    this._address = host && host.hasValue ? `http://${host}` : '';
    this._authorization = password && password.hasValue ? `Basic ${btoa(':' + password.value)}` : '';
  }

  /**
   * Promises to create the series.
   * @return The promise to create the series.
   */
  create(): mio.ILibraryHandler<(seriesAddress: string) => mio.IOptionPromise<number>> {
    return mio.createHandler(async (seriesAddress: string) => {
      return this._handleNotFound(mio.option<number>(), async () => {
        let result = await this._fetch().json<number>(`${this._address}/api/library`, {}).postAsync({seriesAddress: seriesAddress});
        return mio.option(result);
      });
    });
  }

  /**
   * Promises to delete the series/chapter.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter identifier.
   * @return The promise to delete the series/chapter.
   */
  async deleteAsync(seriesId: number, chapterId?: number): Promise<boolean> {
    return this._handleNotFound(false, async () => {
      if (chapterId == null) {
        await this._fetch().text(`${this._address}/api/library/${seriesId}`, {}).deleteAsync({});
        return true;
      } else {
        await this._fetch().text(`${this._address}/api/library/${seriesId}/${chapterId}`, {}).deleteAsync({});
        return true;
      }
    });
  }

  /**
   * Promises to download each `series metadata/the series metadata/the chapter`.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to download each `series metadata/the series metadata/the chapter`.
   */
  download(seriesId?: number, chapterId?: number): mio.ILibraryHandler<any> {
    if (seriesId == null && chapterId == null) {
      return mio.createHandler(async (existingChapters: boolean, newChapters: boolean) => {
        let formData: mio.IDictionary = {existingChapters: String(existingChapters), newChapters: String(newChapters)};
        await this._fetch().text(`${this._address}/api/download`, {}).postAsync(formData);
      });
    } else if (chapterId == null) {
      return mio.createHandler(async (existingChapters: boolean, newChapters: boolean) => {
        return this._handleNotFound(false, async () => {
          let formData: mio.IDictionary = {existingChapters: String(existingChapters), newChapters: String(newChapters)};
          await this._fetch().text(`${this._address}/api/download/${seriesId}`, {}).postAsync(formData);
          return true;
        });
      });
    } else {
      return mio.createHandler(async () => {
        return this._handleNotFound<void>(null, async () => {
          await this._fetch().text(`${this._address}/api/download/${seriesId}/${chapterId}`, {}).postAsync({});
        });
      });
    }
  }

  /**
   * Promises the series/page image.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter identifier.
   * @param pageNumber= The page number.
   * @return The promise for the series/page image.
   */
  async imageAsync(seriesId: number, chapterId?: number, pageNumber?: number): Promise<mio.IOption<mio.IBlob>> {
    return this._handleNotFound(mio.option<mio.IBlob>(), async () => {
      if (chapterId == null || pageNumber == null) {
        let result = await this._fetch().blob(`${this._address}/content/${seriesId}`, {}).getAsync();
        return mio.option(result);
      } else {
        let result = await this._fetch().blob(`${this._address}/content/${seriesId}/${chapterId}/${pageNumber}`, {}).getAsync();
        return mio.option(result);
      }
    });
  }

  /**
   * Promises the list of series/chapters.
   * @param seriesId The series identifier.
   * @return The promise for the list of series/chapters.
   */
  async listAsync(seriesId?: number): Promise<any> {
    if (seriesId == null) {
      let result = await this._fetch().json<mio.ILibrarySeries[]>(`${this._address}/api/library`, {}).getAsync();
      return result;
    } else {
      return this._handleNotFound(mio.option<mio.ILibraryChapter[]>(), async () => {
        let result = await this._fetch().json<mio.ILibraryChapter[]>(`${this._address}/api/library/${seriesId}`, {}).getAsync();
        return mio.option(result);
      });
    }
  }

  /**
   * Promises to set the password.
   * @return The promise to set the password.
   */
  password(): mio.ILibraryHandler<(password: string) => Promise<void>> {
    return mio.createHandler(async (password: string) => {
      await this._fetch().text(`${this._address}/api`, {}).postAsync({password: password});
    });
  }

  /**
   * Promises to propagate and archive the setting.
   * @param settings The settings.
   * @return The promise to propagate and archive the setting.
   */
  setting(): mio.ILibraryHandler<(key: string, value: string) => Promise<void>> {
    return mio.createHandler(async (key: string, value: string) => {
      await this._fetch().text(`${this._address}/api/setting`, {}).patchAsync({key: key, value: value});
    });
  }

  /**
   * Promises to set the number of read pages status.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to set the number of read pages status.
   */
  status(seriesId: number, chapterId: number): mio.ILibraryHandler<(numberOfReadPages: number) => Promise<boolean>> {
    return mio.createHandler(async (numberOfReadPages: number) => {
      return this._handleNotFound(false, async () => {
        let formData: mio.IDictionary = {numberOfReadPages: String(numberOfReadPages)};
        await this._fetch().text(`${this._address}/api/library/${seriesId}/${chapterId}`, {}).patchAsync(formData);
        return true;
      });
    });
  }

  /**
   * Promises the version.
   * @return The promise for the version.
   */
  versionAsync(): Promise<{api: number}> {
    return this._fetch().json<{api: number}>(`${this._address}/api`, {}).getAsync();
  }

  /**
   * Fetches a HTTP service with authorization.
   * @return The HTTP service with authorization.
   */
  private _fetch(): mio.IHttpService {
    if (!this._authorization) {
      return httpService();
    } else {
      return {
        blob: (address: string|string[]) => httpService().blob(address, {Authorization: this._authorization}),
        json: <T>(address: string|string[]) => httpService().json(address, {Authorization: this._authorization}),
        text: (address: string|string[]) => httpService().text(address, {Authorization: this._authorization})
      }
    }
  }

  /**
   * Promises to handle a not found error and return the default value instead.
   * @param defaultValue The default value.
   * @param action The action.
   * @return The promise to handle a not found error and return the default value instead.
   */
  private async _handleNotFound<T>(defaultValue: T, action: () => Promise<T>): Promise<T> {
    try {
      let result = await action();
      return result;
    } catch (error) {
      if (error instanceof mio.HttpServiceError) {
        let httpServiceError = error as mio.HttpServiceError;
        if (httpServiceError.statusCode === 404) {
          return defaultValue;
        }
      }
      throw error;
    }
  }
}
