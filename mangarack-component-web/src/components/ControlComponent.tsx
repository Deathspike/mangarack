import * as mio from '../default';

/**
 * Represents a control component.
 */
export class ControlComponent extends mio.StatelessComponent<void> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="control">
        <span className="chevron-left" onClick={() => mio.applicationActions.navigateBack()}><i className="fa fa-chevron-left"></i></span>
        <span className="plus" onClick={() => mio.modalActions.setType(mio.ModalType.Series)}><i className="fa fa-plus"></i></span>
        <span className="download" onClick={() => mio.modalActions.setType(mio.ModalType.Download)}><i className="fa fa-download"></i></span>
        <span className="refresh" onClick={() => mio.applicationActions.refresh()}><i className="fa fa-refresh"></i></span>
      </div>
    );
  }
}
