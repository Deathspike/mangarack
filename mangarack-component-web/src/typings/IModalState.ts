import * as mio from '../default';

/**
 * Represents the modal state.
 */
export interface IModalState {
  /**
   * Contains the error.
   */
  error?: string;

  /**
   * Contains the type.
   */
  type: mio.ModalType;
}
