import * as mio from './module';

/**
 * Promises the remote library.
 * @param host The host.
 * @param password The password.
 * @return The promise for the remote library.
 */
export async function openRemoteLibraryAsync(host: mio.IOption<string>, password: mio.IOption<string>): Promise<mio.IOption<mio.ILibrary>> {
  throw new Error('TODO: Not yet implemented.');
}
