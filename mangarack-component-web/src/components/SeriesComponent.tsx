import * as mio from '../default';

/**
 * Represents a series component.
 */
export class SeriesComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <mio.LazyComponent className="series">
        {(() => {
          if (!this.props.series.hasValue) {
            return <i className="fa fa-spin fa-circle-o-notch"></i>;
          } else {
            return <mio.SeriesListComponent series={this.props.series.value} />;
          }
        })()}
      </mio.LazyComponent>
    );
  }
}
