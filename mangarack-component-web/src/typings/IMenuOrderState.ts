import * as mio from '../default';

/**
 * Represents the menu order state.
 */
export interface IMenuOrderState {
  /**
   * Indicates whether the direction is ascending.
   */
  ascending: boolean;

  /**
   * Contains the type.
   */
  type: mio.OrderType;
}
