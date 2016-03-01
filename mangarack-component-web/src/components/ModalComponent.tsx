import * as mio from '../default';

/**
 * Represents a modal component.
 */
export class ModalComponent extends mio.StatelessComponent<{modal: mio.IModalState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Modal pending. */
    /* TODO: Modal error. */
    if (this.props.modal.type !== mio.ModalType.None) {
      return (
        <div className="modal">
          <div className="modalContainer">
            {(() => {
              switch (this.props.modal.type) {
                case mio.ModalType.Download:
                  return <mio.ModalDownloadComponent />;
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
