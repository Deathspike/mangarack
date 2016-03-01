import * as mio from '../default';

/**
 * Represents a modal component.
 */
export class ModalComponent extends mio.StatelessComponent<{modal: mio.IModalState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    if (this.props.modal.type !== mio.ModalType.None) {
      return (
        <div className="modal">
          <div className="modalContainer">
            {(() => {
              switch (this.props.modal.type) {
                case mio.ModalType.Download:
                  return <mio.ModalDownloadComponent />;
                case mio.ModalType.Error:
                  return <mio.ModalErrorComponent error={this.props.modal.error} />;
                case mio.ModalType.Pending:
                  return <mio.ModalPendingComponent />;
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
