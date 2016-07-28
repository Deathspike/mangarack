import * as mio from '../default';
import * as mioInternal from './module';

/**
 * Promises the remote library.
 * @param host The host.
 * @param password The password.
 * @return The promise for the remote library.
 */
export async function openRemoteLibraryAsync(host?: string, password?: string): Promise<mio.IOption<mio.ILibrary>> {
  let remoteLibrary = new mioInternal.RemoteLibrary(host, password);
  try {
    let result = await remoteLibrary.versionAsync();
    if (result.api === mioInternal.version) {
      return remoteLibrary;
    } else {
      return undefined;
    }
  } catch (error) {
    if (error instanceof mio.HttpServiceError) {
      let httpServiceError = error as mio.HttpServiceError;
      if (httpServiceError.statusCode === 401) {
        return undefined;
      }
    }
    throw error;
  }
}
