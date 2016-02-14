/* TODO: Change `contextService` to object, instead of class, but somehow, that trips up TypeScript. Why? */
import * as mio from '../module';
let context = mio.option<mio.IContext>();
let fileService = mio.dependency.get<mio.IFileService>('IFileService');
let isSaving = false;
let shouldSaveAgain = false;

/**
 * Represents the context service.
 */
export class contextService {
  /**
   * Promises the context.
   * @return The promise for the context.
   */
  static async getContextAsync(): Promise<mio.IContext> {
    if (context.value === null) {
      let deserializedContext = await fileService().readObjectAsync<mio.IContext>('db.mrdb');
      if (context.value === null) {
        if (deserializedContext.value == null) {
          context = mio.option<mio.IContext>({
            lastId: 1,
            providers: {},
            password: mio.option<string>()
          });
        } else {
          context = deserializedContext;
        }
      }
    }
    return context.value;
  }

  /**
   * Saves the changes.
   */
  static saveChanges(): void {
    if (isSaving) {
      shouldSaveAgain = true;
    } else if (context.value != null) {
      isSaving = true;
      fileService().writeObjectAsync('db.mrdb', context.value).then(() => {
        isSaving = false;
        if (shouldSaveAgain) {
          shouldSaveAgain = false;
          this.saveChanges();
        }
      });
    }
  }
};
