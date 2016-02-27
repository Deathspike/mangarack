import * as mio from '../default';

/**
 * Represents each application action.
 * @internal
 */
export let applicationActions = {
  /**
   * Sets the series
   * @param revisor The filter type.
   */
  setSeries: mio.store.reviser('APPLICATION_SETSERIES', function(state: mio.IApplicationState, series: mio.ILibrarySeries[]): void {
    state.series = mio.option(series);
  })
};
