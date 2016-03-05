import * as mio from '../default';

/**
 * Represents a menu control component.
 */
export class MenuControlComponent extends mio.StatelessComponent<void> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuControl">
        <i className="fa fa-plus" onClick={() => mio.modalActions.setType(mio.ModalType.Series)}></i>
        <i className="fa fa-download" onClick={() => mio.modalActions.setType(mio.ModalType.Download)}></i>
        <i className="fa fa-refresh" onClick={() => mio.applicationActions.refreshSeries()}></i>
      </div>
    );
  }
}
