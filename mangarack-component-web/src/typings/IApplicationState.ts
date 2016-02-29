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
   * Contains the modal type.
   */
  modalType: mio.ModalType;

  /**
   * Contains each series.
   */
  series: mio.IOption<mio.ILibrarySeries[]>;
}
