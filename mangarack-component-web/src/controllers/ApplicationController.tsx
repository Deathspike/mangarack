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
    mio.applicationActions.refreshSeries();
    window.addEventListener('hashchange', () => this.forceUpdate());
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <span>
        <mio.ModalComponent modal={this.state.modal} />
        {(() => {
          let hash = mio.parseLocation();
          if (hash.seriesId.hasValue) {
            return <mio.ChapterController application={this.state} seriesId={hash.seriesId.value} />;
          } else {
            return <mio.SeriesController application={this.state} />;
          }
        })()}
      </span>
    );
  }
}
