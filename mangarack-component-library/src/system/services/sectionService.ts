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

  static async getUserContextAsync(): Promise<mio.IUserLibraryContext> {
    let context = await fileService().readObjectAsync<mio.IUserLibraryContext>('user.json');
    if (context.value != null) {
      return context.value;
    } else {
      return {users: {admin: {id: 1, password: 'admin'}} as any, nextId: 2};
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

  static async writeUserContextAsync(context: mio.IUserLibraryContext): Promise<void> {
    return fileService().writeObjectAsync('user.json', context);
  }

  static async writeSeriesContextAsync(context: mio.ISeriesLibraryContext): Promise<void> {
    return fileService().writeObjectAsync('series.json', context);
  }
};
