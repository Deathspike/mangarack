import * as mio from '../default';

/**
 * Represents a chapters component.
 */
export class ChaptersComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>, seriesId: number}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <mio.LazyComponent className="chapters">
        {(() => {
          if (!this.props.series.hasValue) {
            return <i className="fa fa-spin fa-circle-o-notch"></i>;
          } else {
            return <span>Here be dragons for {this.props.seriesId}.</span>
          }
        })()}
      </mio.LazyComponent>
    );
  }
}
