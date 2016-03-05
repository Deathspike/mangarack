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
  navigateSeries: mio.store.reviser('APPLICATION_NAVIGATESERIES', function(state: mio.IApplicationState, seriesId: number): void {
    let hash = mio.parseLocation();
    let newHash = `#/${seriesId}`;
    if (hash.seriesId.hasValue) {
      window.history.replaceState(undefined, undefined, newHash);
    } else {
      window.history.pushState(undefined, undefined, newHash);
    }
  }),

  /**
   * Refreshes the series.
   */
  refreshSeries: mio.store.reviser('APPLICATION_REFRESHSERIES', async function(state: mio.IApplicationState): Promise<void> {
    /* TODO: Handle refresh series errors. */
    applicationActions.setSeries(null);
    let series = await mio.openActiveLibrary().listAsync();
    applicationActions.setSeries(series);
  }),

  /**
   * Sets the series
   * @param series The series.
   */
  setSeries: mio.store.reviser('APPLICATION_SETSERIES', function(state: mio.IApplicationState, series: mio.ILibrarySeries[]): void {
    state.series.all = mio.option(series);
    state.series.processed = mio.processSeries(state.menu, state.series.all);
    if (!state.series.all.hasValue) {
      for (let seriesId in mio.cache) {
        let url = mio.cache[seriesId];
        if (url) {
          URL.revokeObjectURL(url);
          delete mio.cache[seriesId];
        }
      }
    }
  })
};
