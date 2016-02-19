/* TODO: Change `contextService` to object, instead of class, but somehow, that trips up TypeScript. Why? */
'use strict';
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
    if (!context.hasValue) {
      let deserializedContext = await fileService().readObjectAsync<mio.IContext>('context.mrx');
      if (!context.hasValue) {
        if (!deserializedContext.hasValue) {
          let password = mio.option<string>();
          context = mio.option<mio.IContext>({lastId: 0, providers: {}, password: password, settings: {}, version: mio.version});
          contextService.saveChanges();
        } else {
          context = deserializedContext;
          tryUpgrade(context.value);
          for (let key in context.value.settings) {
            mio.settingService.set(key, context.value.settings[key]);
          }
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
    } else if (context.hasValue) {
      isSaving = true;
      fileService().writeObjectAsync('context.mrx', context.value).then(done, done);
    }
  }
};

/**
 * Occurs when changes have been saved.
 */
function done(): void {
  isSaving = false;
  if (shouldSaveAgain) {
    shouldSaveAgain = false;
    contextService.saveChanges();
  }
}

/**
 * Tries to upgrade the context to support the latest version.
 * @param context The context.
 */
function tryUpgrade(context: mio.IContext): void {
  // [20160219] Added settings and versioning.
  if (!context.settings) {
    context.settings = {};
    context.version = 2;
  }
}
