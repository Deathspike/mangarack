import * as mio from '../default';
import * as mioInternal from './module';

/**
 * Promises the library.
 * @param password The password.
 * @return The promise for the library.
 */
export async function openLibraryAsync(password: string): Promise<mio.IOption<mio.ILibrary>> {
  let context = await mioInternal.contextService.getContextAsync();
  if (context.password && context.password !== password) {
    return undefined;
  } else {
    return mioInternal.library;
  }
}
