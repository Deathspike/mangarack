import * as mio from '../default';

/**
 * Represents a series component.
 */
export class SeriesComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Empty text. */
    return (
      <div className="series">
        {this.props.series.hasValue ?
          this.props.series.value.map(series => <mio.SeriesItemComponent series={series} />) :
          <div className="pending"><i className="fa fa-spin fa-circle-o-notch"></i></div>}
      </div>
    );
  }
}
