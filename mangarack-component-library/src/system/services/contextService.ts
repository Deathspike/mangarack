import * as mio from '../module';
let context = mio.option<mio.IContext>();
let fileService = mio.dependency.get<mio.IFileService>('IFileService');
let isSaving = false;
let shouldSaveAgain = false;

/**
 * Represents the context service.
 * @internal
 */
export let contextService = {
  /**
   * Promises the context.
   * @return The promise for the context.
   */
  getContextAsync: async function(): Promise<mio.IContext> {
    if (!context.hasValue) {
      let deserializedContext = await fileService().readObjectAsync<mio.IContext>('context.mrx');
      if (!context.hasValue) {
        if (!deserializedContext.hasValue) {
          let password = mio.option<string>();
          context = mio.option<mio.IContext>({lastId: 0, password: password, providers: {}, settings: {}, version: mio.version});
          contextService.saveChanges();
        } else {
          context = deserializedContext;
          tryUpgrade();
          for (let key in context.value.settings) {
            if (context.value.settings.hasOwnProperty(key)) {
              mio.settingService.set(key, context.value.settings[key]);
            }
          }
        }
      }
    }
    return context.value;
  },

  /**
   * Saves the changes.
   */
  saveChanges: function(): void {
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
 */
function tryUpgrade(): void {
  // [20160219] Added settings and versioning.
  if (context.hasValue) {
    context.value.settings = {};
    context.value.version = 2;
  }
}
