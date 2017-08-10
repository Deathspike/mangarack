import * as mio from '../module';
const fileService = mio.dependency.get<mio.IFileService>('IFileService');
let context: mio.IOption<mio.IContext>;
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
    if (!context) {
      let deserializedContext = await fileService().readObjectAsync<mio.IContext>('mangarack');
      if (!context) {
        if (!deserializedContext) {
          context = {lastSeriesId: 0, password: '', providers: {}, settings: {}, version: mio.version};
          contextService.saveChanges();
        } else {
          context = deserializedContext;
          for (let key in context.settings) {
            if (context.settings.hasOwnProperty(key)) {
              mio.settingService.set(key, context.settings[key]);
            }
          }
        }
      }
    }
    return context;
  },

  /**
   * Saves the changes.
   */
  saveChanges: function(): void {
    if (isSaving) {
      shouldSaveAgain = true;
    } else if (context) {
      isSaving = true;
      fileService().writeObjectAsync('mangarack', context).then(done, done);
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
