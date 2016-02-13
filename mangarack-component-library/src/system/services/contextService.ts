/* TODO: Change `contextService` to object, instead of class, but somehow, that trips up TypeScript. Why? */
import * as mio from '../module';
let fileService = mio.dependency.get<mio.IFileService>('IFileService');
let readContext = mio.option<mio.IContext>();
let readPath = 'context.json';
let writePromise = mio.option<Promise<void>>();
let writeQueue = 0;

/**
 * Represents the context service.
 */
export class contextService {
  /**
   * Promises to context.
   * @return The promise for the context.
   */
  static async readContext(): Promise<mio.IContext> {
    if (readContext.value == null) {
      let fileContext = readContext = await fileService().readObjectAsync<mio.IContext>(readPath);
      if (readContext.value == null) {
        if (fileContext.value != null) {
          readContext = fileContext;
        } else {
          readContext = mio.option<mio.IContext>({
            lastId: 1,
            providers: {},
            users: {admin: {id: 1, password: 'admin'}}
          });
        }
      }
    }
    return readContext.value;
  }

  /**
   * Promises to write the context to file.
   * @return The promise to write the context to file.
   */
  static async writeContext(): Promise<void> {
    if (writePromise.value != null) {
      writeQueue++;
      await writePromise.value;
      writeQueue--;
      if (writeQueue === 0) {
        await this.writeContext();
      }
    } else if (readContext.value != null) {
      writePromise = mio.option(fileService().writeObjectAsync(readPath, readContext));
      await writePromise.value;
      writePromise = mio.option<Promise<void>>();
    }
  }
};
