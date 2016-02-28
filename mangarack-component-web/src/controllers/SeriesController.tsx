import * as mio from '../default';

/**
 * Represents a series controller.
 */
export class SeriesController extends mio.StatelessComponent<{application: mio.IApplicationState}> {
  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    super.componentWillMount();
    this._loadSeries();
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div>
        <div id="header">
          {/* TODO: Back. */}
          {/* TODO: Download. */}
          {/* TODO: Settings. */}
          MangaRack
        </div>
        <div id="container">
          <mio.MenuComponent application={this.props.application} />
          <mio.SeriesComponent series={this.props.application.series} />
        </div>
      </div>
    );
  }

  /**
   * Promises to load the series.
   */
  private async _loadSeries(): Promise<void> {
    let series = await mio.openActiveLibrary().listAsync();
    mio.applicationActions.setSeries(series);
  }
}
