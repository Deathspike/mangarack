import * as mio from '../default';

/**
 * Represents a modal pending component.
 */
export class ModalErrorComponent extends mio.StatelessComponent<{error: mio.IOption<string>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <span>
        <div className="modalContainerTitle">
          <span className="text">Error</span>
          <i className="fa fa-times-circle" onClick={() => mio.modalActions.setType(mio.ModalType.None)} />
        </div>
        <div className="modalContainerBody">
          {(() => {
            if (this.props.error.hasValue) {
              return this.props.error.value;
            } else {
              return 'An unknown error has occurred.';
            }
          })()}
        </div>
      </span>
    );
  }
}
