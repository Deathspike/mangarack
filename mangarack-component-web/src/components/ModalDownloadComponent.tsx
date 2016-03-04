import * as mio from '../default';

/**
 * Represents a modal series component.
 */
export class ModalDownloadComponent extends mio.StatefulComponent<void, {existingChapters: boolean, newChapters: boolean}> {
  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    super.componentWillMount();
    this.componentWillReceiveProps();
  }


  /**
   * Occurs when the component is receiving properties.
   */
  public componentWillReceiveProps() {
    this.setState({existingChapters: false, newChapters: false});
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <span>
        <div className="modalContainerTitle">
          <span className="text">Update Series</span>
          <i className="fa fa-times-circle" onClick={() => mio.modalActions.setType(mio.ModalType.None)} />
        </div>
        <div className="modalContainerBody modalContainerDownload">
          <p onClick={() => this._onChangeExistingChapters()}>
            {(() => {
              if (this.state.existingChapters) {
                return <i className="fa fa-check-circle"></i>;
              } else {
                return <i className="fa fa-times-circle"></i>
              }
            })()}
            <span className="text">Queue existing chapters download</span>
          </p>
          <p onClick={() => this._onChangeNewChapters()}>
            {(() => {
              if (this.state.newChapters) {
                return <i className="fa fa-check-circle"></i>;
              } else {
                return <i className="fa fa-times-circle"></i>
              }
            })()}
            <span className="text">Queue new chapters download</span>
          </p>
          <button onClick={() => this._onClick()}>Start</button>
        </div>
      </span>
    );
  }

  /**
   * Toggles the existing chapter state.
   */
  private _onChangeExistingChapters(): void {
    this.setState({existingChapters: !this.state.existingChapters, newChapters: this.state.newChapters});
  }

  /**
   * Toggles the new chapter state.
   */
  private _onChangeNewChapters(): void {
    this.setState({existingChapters: this.state.existingChapters, newChapters: !this.state.newChapters});
  }

  /**
   * Occurs when the button is clicked.
   */
  private _onClick(): void {
    mio.modalActions.downloadSeries(this.state);
  }
}
