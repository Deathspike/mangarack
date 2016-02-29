import * as mio from '../default';

/**
 * Represents a modal component.
 */
export class ModalComponent extends mio.StatelessComponent<{modalType: mio.ModalType}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    if (this.props.modalType !== mio.ModalType.None) {
      return (
        <div className="modal">
          <div className="modalContainer">
            {(() => {
              switch (this.props.modalType) {
                case mio.ModalType.Series:
                  return <mio.ModalSeriesComponent />;
                default:
                  return null;
              }
            })()}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
