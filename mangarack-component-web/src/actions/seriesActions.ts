import * as mio from '../default';

/**
 * Represents each series action.
 * @internal
 */
export let seriesActions = {
  /**
   * Sets the series.
   * @param revisor The series.
   */
  setSeries: mio.store.reviser('SERIES_LIBRARY', function(state: mio.IApplicationState, series: mio.ILibrarySeries[]): void {
    state.series = series;
  })
};
