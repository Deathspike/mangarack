/*
TODO: Decorate IFileService to resolve concurrency issues.
*/
import * as mio from '../module';
let fileService = mio.dependency.get<mio.IFileService>('IFileService');

/**
 * Represents the section service.
 */
export class sectionService {
  /*TODO: Change `sectionService` to object, instead of class, but somehow, that trips up TypeScript. Not sure why...*/
  /*TODO: Ensure that only a single instance of each object is around. Sections assume these are singleton'd and saves are concurrent-safe.*/

  static async getAccountContextAsync(): Promise<mio.IAccountLibraryContext> {
    let context = await fileService().readObjectAsync<mio.IAccountLibraryContext>('account.json');
    if (context.value != null) {
      return context.value;
    } else {
      return {accounts: {admin: {id: 1, password: 'admin'}} as any, nextId: 2};
    }
  }

  static async getSeriesContextAsync(): Promise<mio.ISeriesLibraryContext> {
    let context = await fileService().readObjectAsync<mio.ISeriesLibraryContext>('series.json');
    if (context.value != null) {
      return context.value;
    } else {
      return {nextId: 1, providers: {} as any};
    }
  }

  static async writeAccountContextAsync(context: mio.IAccountLibraryContext): Promise<void> {
    return fileService().writeObjectAsync('account.json', context);
  }
};
