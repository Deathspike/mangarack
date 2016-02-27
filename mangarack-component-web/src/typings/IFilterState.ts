import * as mio from '../default';

/**
 * Represents the filter state.
 */
export interface IFilterState {
  /**
   * Contains each genre type status.
   */
  genres: {[key: number]: boolean};

  /**
   * Contains the type.
   */
  type: mio.FilterType;
}
