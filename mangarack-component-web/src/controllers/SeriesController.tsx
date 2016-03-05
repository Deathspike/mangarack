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
      <span>
        <mio.MenuComponent controller="series" menu={this.props.application.menu} series={this.props.application.series.processed} />
        <mio.SeriesComponent series={this.props.application.series.processed} />
      </span>
    );
  }
}
