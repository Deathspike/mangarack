import * as mio from './module';

/**
 * Promises the library.
 * @param password= The password.
 * @return The promise for the library.
 */
export async function openLibraryAsync(password?: mio.IOption<string>): Promise<mio.IOption<mio.ILibrary>> {
  if (password != null && password.value != null) {
    let context = await mio.contextService.getContextAsync();
    if (context.password.value != null || context.password.value != password.value) {
      return null;
    }
  }
  return mio.option(mio.library);
}
