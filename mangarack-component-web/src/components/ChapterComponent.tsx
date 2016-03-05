import * as mio from '../default';

/**
 * Represents a chapter component.
 */
export class ChapterComponent extends mio.StatelessComponent<{chapters: mio.IOption<mio.ILibraryChapter[]>, series: mio.IOption<mio.ILibrarySeries[]>, seriesId: number}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <mio.LazyComponent className="chapters">
        <mio.ControlComponent />
        {(() => {
          if (!this.props.chapters.hasValue || !this.props.series.hasValue) {
            return <i className="fa fa-spin fa-circle-o-notch"></i>;
          } else {
            let series = mio.option(this.props.series.value.find(series => series.id === this.props.seriesId));
            if (!series.hasValue) {
              return <span className="unknown">Unknown series.</span>;
            } else {
              return <span>Chapter placeholder for {this.props.seriesId}.</span>
            }
          }
        })()}
      </mio.LazyComponent>
    );
  }
}
