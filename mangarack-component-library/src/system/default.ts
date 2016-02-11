import * as mio from './module';
let fileService = mio.dependency.get<mio.IFileService>('IFileService');
let library = mio.option<mio.AccountSection>();

/**
 * Promises the library.
 * @param credentials= The credentials.
 * @return The promise for the library.
 */
export async function openLibraryAsync(credentials?: mio.IOption<{accountName: string, password: string}>): Promise<mio.IOption<mio.IAccountLibrary>> {
  // Check the library and initialize it when applicable.
  if (library.value == null) {
    let context = await mio.sectionService.getAccountContextAsync();
    library = mio.option(new mio.AccountSection(context));
  }

  // Check the authentication and validate it when applicable.
  if (credentials != null && credentials.value != null) {
    let isValid = await library.value.isValid(credentials.value.accountName, credentials.value.password);
    if (!isValid) {
      return mio.option<mio.IAccountLibrary>();
    }
  }

  // Return the library.
  return library;
}
