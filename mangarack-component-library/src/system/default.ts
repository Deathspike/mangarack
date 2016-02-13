import * as mio from './module';
let library = mio.option<mio.SeriesSection>();

/**
 * Promises the library.
 * @param password= The password.
 * @return The promise for the library.
 */
export async function openLibraryAsync(password?: mio.IOption<string>): Promise<mio.IOption<mio.ISeriesLibrary>> {
  // Check the library and initialize it when applicable.
  if (library.value == null) {
    let context = await mio.contextService.readContext();
    library = mio.option(new mio.SeriesSection(context));
  }

  // Check the password and authenticate when applicable.
  if (password != null && password.value != null) {
    let context = await mio.contextService.readContext();
    if (context.password.value != null || context.password.value != password.value) {
      return null;
    }
  }

  // Return the library.
  return library;
}
