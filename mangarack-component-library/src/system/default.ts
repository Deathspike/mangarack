'use strict';
import * as mio from './module';

/**
 * Promises the library.
 * @param password= The password.
 * @return The promise for the library.
 */
export async function openLibraryAsync(password?: mio.IOption<string>): Promise<mio.IOption<mio.ILibrary>> {
  if (password != null && password.hasValue) {
    let context = await mio.contextService.getContextAsync();
    if (context.password.hasValue && context.password.value != password.value) {
      return mio.option<mio.ILibrary>();
    }
  }
  return mio.option(mio.library);
}
