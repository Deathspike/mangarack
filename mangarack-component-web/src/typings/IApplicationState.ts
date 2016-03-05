import * as mio from '../default';

/**
 * Represents the application state.
 */
export interface IApplicationState {
  /**
   * Contains the menu state.
   */
  menu: mio.IMenuState;

  /**
   * Contains the modal state.
   */
  modal: mio.IModalState;

  /**
   * Contains each series.
   */
  series: {all: mio.IOption<mio.ILibrarySeries[]>, processed: mio.IOption<mio.ILibrarySeries[]>};
}
