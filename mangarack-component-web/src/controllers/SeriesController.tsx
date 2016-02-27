import * as mio from '../default';

/**
 * Represents a series controller.
 */
export class SeriesController extends mio.StatelessComponent<{state: mio.ILibrarySeries[]}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div>
        <div id="header">
          {/* TODO: back */}
          {/* TODO: download */}
          {/* TODO: settings */}
          MangaRack
        </div>
        <div id="container">
          {/* TODO: add */}
          {/* TODO: search */}
          {/* TODO: filters/order */}
          <mio.SeriesListComponent series={this.props.state} />
        </div>
      </div>
    );
  }
}
