import * as mio from '../default';

/**
 * Represents a control component.
 */
export class ControlComponent extends mio.StatelessComponent<void> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let location = mio.parseLocation();
    if (location.seriesId.hasValue) {
      return (
        <div className="control">
          <div className="chevron-left" onClick={() => mio.applicationActions.navigateBack()}><i className="fa fa-chevron-left"></i></div>
          <div className="trash" onClick={() => mio.modalActions.setType(mio.ModalType.Delete)}><i className="fa fa-trash"></i></div>
          <div className="download" onClick={() => mio.modalActions.setType(mio.ModalType.Download)}><i className="fa fa-download"></i></div>
          <div className="refresh" onClick={() => mio.applicationActions.refreshChapters()}><i className="fa fa-refresh"></i></div>
        </div>
      );
    } else {
      return (
        <div className="control">
          <div className="chevron-left" onClick={() => mio.applicationActions.navigateBack()}><i className="fa fa-chevron-left"></i></div>
          <div className="plus" onClick={() => mio.modalActions.setType(mio.ModalType.Series)}><i className="fa fa-plus"></i></div>
          <div className="download" onClick={() => mio.modalActions.setType(mio.ModalType.Download)}><i className="fa fa-download"></i></div>
          <div className="refresh" onClick={() => mio.applicationActions.refreshSeries()}><i className="fa fa-refresh"></i></div>
        </div>
      );
    }
  }
}
