import * as mio from '../default';

/**
 * Represents each application action.
 * @internal
 */
export let applicationActions = {
  /**
   * Navigates back through the menu or history.
   */
  back: mio.store.reviser('APPLICATION_BACK', function(state: mio.IApplicationState): void {
    if (state.menu.type !== mio.MenuType.Default) {
      state.menu.type = mio.MenuType.Default;
    } else {
      history.back();
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
    state.series = mio.option(series);
    if (!state.series.hasValue) {
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
