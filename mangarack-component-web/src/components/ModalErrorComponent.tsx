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
      <div>
        <div className="modalContainerTitle">
          <span className="text">Error</span>
          <i className="fa fa-times-circle" onClick={() => mio.modalActions.setType(mio.ModalType.None)} />
        </div>
        <div className="modalContainerBody">
          {(() => {
            if (this.props.error.hasValue) {
              return <div>{this.props.error.value}</div>;
            } else {
              return <div>An error has occurred.</div>;
            }
          })()}
        </div>
      </div>
    );
  }
}
