import * as mio from '../default';

/**
 * Represents the application state.
 */
export interface IApplicationState {
  /**
   * Contains each series.
   */
  series: mio.ILibrarySeries[];
}
