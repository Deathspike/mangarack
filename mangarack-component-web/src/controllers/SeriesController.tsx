import * as mio from '../default';

/**
 * Represents a series controller.
 */
export class SeriesController extends mio.StatelessComponent<{application: mio.IApplicationState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div>
        <div id="header">
          <mio.HeaderBackComponent />
          {/* TODO: Settings. */}
          <span className="title">MangaRack</span>
        </div>
        <div id="container">
          <mio.MenuComponent menu={this.props.application.menu} series={this.props.application.series.processed} />
          <mio.SeriesComponent series={this.props.application.series.processed} />
        </div>
      </div>
    );
  }
}
