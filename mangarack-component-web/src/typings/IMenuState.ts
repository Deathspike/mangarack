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
   * Contains the order direction and type.
   */
  order: mio.IMenuOrderState;

  /**
   * Contains the search.
   */
  search: string;

  /**
   * Contains the type.
   */
  type: mio.MenuType;
}
