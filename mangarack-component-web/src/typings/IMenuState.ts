import * as mio from '../default';

/**
 * Represents the menu state.
 */
export interface IMenuState {
  /**
   * Contains each genre type filter.
   */
  genres: {[key: number]: boolean};

  /**
   * Contains the type.
   */
  type: mio.MenuType;
}
