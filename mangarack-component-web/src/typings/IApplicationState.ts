import * as mio from '../default';

/**
 * Represents the application state.
 */
export interface IApplicationState {
  /**
   * Contains the filter state.
   */
  filter: mio.IFilterState;

  /**
   * Contains each series.
   */
  series: mio.IOption<mio.ILibrarySeries[]>;
}
