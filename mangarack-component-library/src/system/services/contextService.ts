/* TODO: Change `contextService` to object, instead of class, but somehow, that trips up TypeScript. Why? */
import * as mio from '../module';
let globalContext = mio.option<mio.IContext>();
let fileService = mio.dependency.get<mio.IFileService>('IFileService');
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
    if (globalContext.value == null) {
      let fileContext = globalContext = await fileService().readObjectAsync<mio.IContext>(mio.pathOf());
      if (globalContext.value == null) {
        if (fileContext.value != null) {
          globalContext = fileContext;
        } else {
          globalContext = mio.option<mio.IContext>({
            lastId: 1,
            providers: {},
            password: mio.option<string>()
          });
        }
      }
    }
    return globalContext.value;
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
    } else if (globalContext.value != null) {
      writePromise = mio.option(fileService().writeObjectAsync(mio.pathOf(), globalContext));
      await writePromise.value;
      writePromise = mio.option<Promise<void>>();
    }
  }
};
