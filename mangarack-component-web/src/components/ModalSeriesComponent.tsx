import * as mio from '../default';

/**
 * Represents a modal series component.
 */
export class ModalSeriesComponent extends mio.StatelessComponent<void> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div>
        <div className="modalContainerTitle">
          <span className="text">Add Series</span>
          <i className="fa fa-times-circle" onClick={() => mio.applicationActions.setModalType(mio.ModalType.None)} />
        </div>
        <div className="modalContainerBody">
          <input type="text" />
          <button className="primary">Add</button>
        </div>
      </div>
    );
  }
}
