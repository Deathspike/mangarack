import * as mio from '../default';

/**
 * Represents a modal pending component.
 */
export class ModalPendingComponent extends mio.StatelessComponent<void> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <span>
        <div className="modalContainerTitle">
          <span className="text">Busy</span>
          <i className="fa fa-times-circle" onClick={() => mio.modalActions.setType(mio.ModalType.None)} />
        </div>
        <div className="modalContainerBody">
          <i className="fa fa-spin fa-circle-o-notch"></i>
        </div>
      </span>
    );
  }
}
