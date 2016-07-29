import * as mio from '../default';

/**
 * Represents each application action.
 * @internal
 */
export let applicationActions = {
  /**
   * Navigates back through the menu or history.
   */
  navigateBack: mio.store.reviser('APPLICATION_NAVIGATEBACK', function(state: mio.IApplicationState): void {
    if (state.menu.type !== mio.MenuType.Default) {
      state.menu.type = mio.MenuType.Default;
    } else {
      window.history.back();
    }
  }),

  /**
   * Navigates to the series.
   */
  navigateSeries: mio.store.reviser('APPLICATION_NAVIGATESERIES', async function(state: mio.IApplicationState, seriesId: number): Promise<void> {
    let location = mio.parseLocation();
    let newLocation = `#/${seriesId}`;
    if (location.seriesId) {
      window.history.replaceState(undefined, undefined, newLocation);
      await applicationActions.refreshChapters();
    } else {
      window.history.pushState(undefined, undefined, newLocation);
      await applicationActions.refreshChapters();
    }
  }),

  /**
   * Refreshes the chapters.
   */
  refreshChapters: mio.store.reviser('APPLICATION_REFRESHCHAPTERS', async function(state: mio.IApplicationState): Promise<void> {
    /* TODO: Handle refresh chapters errors. */
    let location = mio.parseLocation();
    if (location.seriesId) {
      mio.applicationActions.setChapters({chapters: undefined, seriesId: undefined});
      let chapters = await mio.openActiveLibrary().listAsync(location.seriesId);
      mio.applicationActions.setChapters({chapters: chapters, seriesId: location.seriesId});
    }
  }),

  /**
   * Refreshes the series.
   */
  refreshSeries: mio.store.reviser('APPLICATION_REFRESH', async function(state: mio.IApplicationState): Promise<void> {
    /* TODO: Handle refresh series errors. */
    mio.applicationActions.setSeries({});
    let series = await mio.openActiveLibrary().listAsync();
    mio.applicationActions.setSeries({series: series});
  }),

  /**
   * Sets the chapters
   * @param seriesId The series identifier.
   * @param chapters The chapters.
   */
  setChapters: mio.store.reviser('APPLICATION_SETCHAPTERS', function(state: mio.IApplicationState, revision: {chapters?: mio.ILibraryChapter[], seriesId?: number}): void {
    state.chapters = revision.chapters;
    if (revision.seriesId && mio.cache[revision.seriesId]) {
      deleteImageFromCache(revision.seriesId);
    }
  }),

  /**
   * Sets the series
   * @param series The series.
   */
  setSeries: mio.store.reviser('APPLICATION_SETSERIES', function(state: mio.IApplicationState, revision: {series?: mio.ILibrarySeries[]}): void {
    state.series.all = revision.series;
    state.series.processed = mio.processSeries(state.menu, state.series.all);
    if (!state.series.all) {
      for (let seriesId in mio.cache) {
        if (mio.cache.hasOwnProperty(seriesId)) {
          deleteImageFromCache(parseInt(seriesId, 10));
        }
      }
    }
  })
};

/**
 * Deletes the image from cache.
 * @param seriesId The series identifier.
 */
function deleteImageFromCache(seriesId: number): void {
  let url = mio.cache[seriesId];
  if (url) {
    URL.revokeObjectURL(url);
    delete mio.cache[seriesId];
  }
}
