import * as mio from './module';
let fileService = mio.dependency.get<mio.IFileService>('IFileService');
let library = mio.option<mio.UserSection>();

/**
 * Promises the library.
 * @param credentials= The credentials.
 * @return The promise for the library.
 */
export async function openLibraryAsync(credentials?: mio.IOption<{userName: string, password: string}>): Promise<mio.IOption<mio.IUserLibrary>> {
  // Check the library and initialize it when applicable.
  if (library.value == null) {
    let context = await mio.contextService.readContext();
    library = mio.option(new mio.UserSection(context));
  }

  // Check the authentication and validate it when applicable.
  if (credentials != null && credentials.value != null) {
    let isValid = await library.value.isValid(credentials.value.userName, credentials.value.password);
    if (!isValid) {
      return mio.option<mio.IUserLibrary>();
    }
  }

  // Return the library.
  return library;
}
