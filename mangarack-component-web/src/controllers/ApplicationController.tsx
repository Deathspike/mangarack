import * as mio from '../default';

/**
 * Represents an application controller.
 */
export class ApplicationController extends mio.StoreComponent<mio.IApplicationState> {
  /**
   * Initializes a new instance of the MainController class.
   */
  public constructor() {
    super(mio.store);
  }

  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    super.componentWillMount();
    window.addEventListener('hashchange', () => {
      if (this.state.modal.type !== mio.ModalType.None) {
        mio.modalActions.setType(mio.ModalType.None);
      } else {
        this.forceUpdate();
      }
    });
    (async function(): Promise<void> {
      await mio.applicationActions.refreshSeries();
      await mio.applicationActions.refreshChapters();
    }());
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <span>
        <mio.ModalComponent modal={this.state.modal} />
        {(() => {
          let location = mio.parseLocation();
          if (location.chapterId.hasValue && location.pageNumber.hasValue) {
            return <mio.PageController application={this.state} seriesId={location.seriesId.value} chapterId={location.chapterId.value} pageNumber={location.pageNumber.value} />;
          } else if (location.seriesId.hasValue) {
            return <mio.ChapterController application={this.state} seriesId={location.seriesId.value} />;
          } else {
            return <mio.SeriesController application={this.state} />;
          }
        })()}
      </span>
    );
  }
}
