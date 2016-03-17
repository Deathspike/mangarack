import * as mio from '../default';

/**
 * Represents a modal series component.
 */
export class ModalDeleteComponent extends mio.StatefulComponent<void, {removeMetadata: boolean}> {
  private _isSeries: boolean;

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
    this._isSeries = !mio.parseLocation().chapterId.hasValue;
    this.setState({removeMetadata: false});
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <span>
        <div className="modalContainerTitle">
          <div className="text">Delete Content</div>
          <i className="fa fa-times-circle" onClick={() => mio.modalActions.setType(mio.ModalType.None)} />
        </div>
        <div className="modalContainerBody modalContainerDelete">
          {(() => {
            if (this._isSeries) {
              return (
                <p onClick={() => this._onChangeRemoveMetadata()}>
                  {(() => {
                    if (this.state.removeMetadata) {
                      return <i className="fa fa-check-circle"></i>;
                    } else {
                      return <i className="fa fa-circle"></i>
                    }
                  })()}
                  <span className="text">Remove metadata</span>
                  <span className="minorText">WARNING: This includes your reading progress.</span>
                </p>
              );
            } else {
              return null;
            }
          })()}
          <button onClick={() => this._onClick()}>Start</button>
        </div>
      </span>
    );
  }

  /**
   * Toggles the remove metadata state.
   */
  private _onChangeRemoveMetadata(): void {
    this.setState({removeMetadata: !this.state.removeMetadata});
  }

  /**
   * Occurs when the button is clicked.
   */
  private _onClick(): void {
    if (this._isSeries) {
      mio.modalActions.deleteSeries(this.state.removeMetadata);
    } else {
      mio.modalActions.deleteChapter({});
    }
  }
}
