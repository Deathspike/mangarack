/* TODO: Change `contextService` to object, instead of class, but somehow, that trips up TypeScript. Why? */
import * as mio from '../module';
let filePath = 'context.json';
let fileService = mio.dependency.get<mio.IFileService>('IFileService');
let singletonContext = mio.option<mio.IContext>();
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
    if (singletonContext.value == null) {
      let context = singletonContext = await fileService().readObjectAsync<mio.IContext>(filePath);
      if (singletonContext.value == null) {
        if (context.value != null) {
          singletonContext = context;
        } else {
          singletonContext = mio.option({
            lastId: 1,
            providers: {} as any,
            users: {admin: {id: 1, password: 'admin'}} as any
          });
        }
      }
    }
    return singletonContext.value;
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
    } else if (singletonContext.value != null) {
      writePromise = mio.option(fileService().writeObjectAsync(filePath, singletonContext));
      await writePromise.value;
      writePromise = mio.option<Promise<void>>();
    }
  }
};
