import * as mio from './module';

/**
 * Promises the remote library.
 * @param host The host.
 * @param password The password.
 * @return The promise for the remote library.
 */
export async function openRemoteLibraryAsync(host: mio.IOption<string>, password: mio.IOption<string>): Promise<mio.IOption<mio.ILibrary>> {
  let remoteLibrary = new mio.RemoteLibrary(host, password);
  try {
    await remoteLibrary.versionAsync();
    return mio.option(remoteLibrary);
  } catch (error) {
    if (error instanceof mio.HttpServiceError) {
      let httpServiceError = error as mio.HttpServiceError;
      if (httpServiceError.statusCode === 401) {
        return mio.option<mio.ILibrary>();
      }
    }
    throw error;
  }
}
