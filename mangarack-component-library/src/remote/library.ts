import * as mio from './module';
const httpService = mio.dependency.get<mio.IHttpService>('IHttpService');

/**
 * Represents a remote library.
 */
export class RemoteLibrary implements mio.ILibrary {
  private _address: string;
  private _authorization: string;

  /**
   * Initializes a new instance of the RemoteLibrary class.
   * @param host The host.
   * @param password The password.
   */
  public constructor(host: string, password: string) {
    this._address = host ? getHostAddress(host) : '';
    this._authorization = password ? `Basic ${mio.convertToBase64(':' + password)}` : '';
  }

  /**
   * Promises to create the series.
   * @return The promise to create the series.
   */
  public create(): mio.ILibraryHandler<(seriesAddress: string) => Promise<mio.IOption<number>>> {
    return mio.createHandler(async (seriesAddress: string) => {
      return handleNotFound(undefined, () => {
        let formData = {seriesAddress};
        return this._fetch().json<number>(`${this._address}/api/library`).postAsync(formData);
      });
    });
  }

  /**
   * Promises to delete the series/chapter.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter identifier.
   * @return The promise to delete the series/chapter.
   */
  public delete(seriesId: number, chapterId?: number): mio.ILibraryHandler<any> {
    if (!chapterId) {
      return mio.createHandler(async (removeMetadata: boolean): Promise<boolean> => {
        return handleNotFound(false, async () => {
          let formData = {removeMetadata: String(removeMetadata)};
          await this._fetch().text(`${this._address}/api/library/${seriesId}`).deleteAsync(formData);
          return true;
        });
      });
    } else {
      return mio.createHandler(async (): Promise<boolean> => {
        return handleNotFound(false, async () => {
          await this._fetch().text(`${this._address}/api/library/${seriesId}/${chapterId}`).deleteAsync();
          return true;
        });
      });
    }
  }

  /**
   * Promises to download each series metadata/the series metadata/the chapter.
   * @param seriesId= The series identifier.
   * @param chapterId= The chapter identifier.
   * @return The promise to download each series metadata/the series metadata/the chapter.
   */
  public download(seriesId?: number, chapterId?: number): mio.ILibraryHandler<any> {
    if (!seriesId && !chapterId) {
      return mio.createHandler(async (existingChapters: boolean, newChapters: boolean) => {
        let formData = {existingChapters: String(existingChapters), newChapters: String(newChapters)};
        await this._fetch().text(`${this._address}/api/download`).postAsync(formData);
      });
    } else if (!chapterId) {
      return mio.createHandler(async (existingChapters: boolean, newChapters: boolean) => {
        return handleNotFound(false, async () => {
          let formData = {existingChapters: String(existingChapters), newChapters: String(newChapters)};
          await this._fetch().text(`${this._address}/api/download/${seriesId}`).postAsync(formData);
          return true;
        });
      });
    } else {
      return mio.createHandler(async () => {
        return handleNotFound(false, async () => {
          await this._fetch().text(`${this._address}/api/download/${seriesId}/${chapterId}`).postAsync();
          return true;
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
  public async imageAsync(seriesId: number, chapterId?: number, pageNumber?: number): Promise<mio.IOption<mio.IBlob>> {
    return handleNotFound(undefined, async () => {
      if (!chapterId || !pageNumber) {
        return await this._fetch().blob(`${this._address}/content/${seriesId}`).getAsync();
      } else {
        return await this._fetch().blob(`${this._address}/content/${seriesId}/${chapterId}/${pageNumber}`).getAsync();
      }
    });
  }

  /**
   * Promises the list of series/chapters.
   * @param seriesId= The series identifier.
   * @return The promise for the list of series/chapters.
   */
  public listAsync(seriesId?: number): Promise<any> {
    if (!seriesId) {
      return this._fetch().json<mio.ILibrarySeries[]>(`${this._address}/api/library`).getAsync();
    } else {
      return handleNotFound(undefined, () => {
        return this._fetch().json<mio.ILibraryChapter[]>(`${this._address}/api/library/${seriesId}`).getAsync();
      });
    }
  }

  /**
   * Promises to set the password.
   * @return The promise to set the password.
   */
  public password(): mio.ILibraryHandler<(password: string) => Promise<void>> {
    return mio.createHandler(async (password: string) => {
      await this._fetch().text(`${this._address}/api`).postAsync({password: password});
    });
  }

  /**
   * Promises to propagate and archive the setting.
   * @param settings The settings.
   * @return The promise to propagate and archive the setting.
   */
  public setting(): mio.ILibraryHandler<(key: string, value: string) => Promise<void>> {
    return mio.createHandler(async (key: string, value: string) => {
      await this._fetch().text(`${this._address}/api/setting`).patchAsync({key: key, value: value});
    });
  }

  /**
   * Promises to set the number of read pages status.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to set the number of read pages status.
   */
  public status(seriesId: number, chapterId: number): mio.ILibraryHandler<(numberOfReadPages: number) => Promise<boolean>> {
    return mio.createHandler(async (numberOfReadPages: number) => {
      return handleNotFound(false, async () => {
        let formData = {numberOfReadPages: String(numberOfReadPages)};
        await this._fetch().text(`${this._address}/api/library/${seriesId}/${chapterId}`).patchAsync(formData);
        return true;
      });
    });
  }

  /**
   * Promises the version.
   * @return The promise for the version.
   */
  public versionAsync(): Promise<{api: number}> {
    return this._fetch().json<{api: number}>(`${this._address}/api`).getAsync();
  }

  /**
   * Fetches a HTTP service with authorization.
   * @return The HTTP service with authorization.
   */
  private _fetch(): mio.IHttpService {
    if (this._authorization) {
      return {
        blob: (address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary) => {
          headers = headers || {};
          headers['Authorization'] = this._authorization;
          return httpService().blob(address, controlType, headers);
        },
        json: (address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary) => {
          headers = headers || {};
          headers['Authorization'] = this._authorization;
          return httpService().json(address, controlType, headers);
        },
        text: (address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary) => {
          headers = headers || {};
          headers['Authorization'] = this._authorization;
          return httpService().text(address, controlType, headers);
        }
      };
    } else {
      return httpService();
    }
  }
}

/**
 * Retrieves the host address.
 * @param host The host.
 * @return The host address.
 */
function getHostAddress(host: string): string {
  if (!/:/.test(host)) {
    host += ':7782';
  }
  if (!/^https?:\/\//i.test(host)) {
    host = `http://${host}`;
  }
  return host;
}

/**
 * Promises to handle a not found error and return the default value instead.
 * @param defaultValue The default value.
 * @param action The action.
 * @return The promise to handle a not found error and return the default value instead.
 */
async function handleNotFound<T>(defaultValue: T, action: () => Promise<T>): Promise<T> {
  try {
    return await action();
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
