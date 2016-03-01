import * as mio from '../default';

/**
 * Represents the modal state.
 */
export interface IModalState {
  /**
   * Contains the error.
   */
  error: mio.IOption<string>;

  /**
   * Indicates a model is pending on an asynchronous operation.
   */
  isPending: boolean;

  /**
   * Contains the type.
   */
  type: mio.ModalType;
}
