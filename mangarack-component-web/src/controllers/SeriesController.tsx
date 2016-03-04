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
    mio.applicationActions.refreshSeries();
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let series = this._filterSeries();
    return (
      <div>
        <mio.ModalComponent modal={this.props.application.modal} />
        <div id="header">
          <mio.HeaderBackComponent />
          {/* TODO: Settings. */}
          <span className="title">MangaRack</span>
        </div>
        <div id="container">
          <mio.MenuComponent menu={this.props.application.menu} series={series} />
          <mio.SeriesComponent series={series} />
        </div>
      </div>
    );
  }

  /**
   * Filters the series.
   * @return The filtered series.
   */
  private _filterSeries(): mio.IOption<mio.ILibrarySeries[]> {
    if (this.props.application.series.hasValue) {
      let menu = this.props.application.menu;
      let requiredGenres = Object.keys(menu.genres).map(genre => parseInt(genre, 10)).filter(genre => menu.genres[genre] === true);
      let searchTerms = menu.search.split(/\s/).map(term => term.toLowerCase());
      return mio.option(this.props.application.series.value.filter(series => {
        for (let genre of series.metadata.genres) {
          if (menu.genres[genre] === false) {
            return false;
          }
        }
        for (let requiredGenre of requiredGenres) {
          if (series.metadata.genres.indexOf(requiredGenre) === -1) {
            return false;
          }
        }
        for (let searchTerm of searchTerms) {
          if (searchTerm && series.metadata.title.toLowerCase().indexOf(searchTerm) === -1) {
            return false;
          }
        }
        return true;
      }).sort((a, b) => {
        let flipOrder = this.props.application.menu.order.ascending ? 1 : -1;
        switch (this.props.application.menu.order.type) {
          case mio.OrderType.DateSeriesAdded: return (a.addedAt > b.addedAt ? 1 : -1) * flipOrder;
          case mio.OrderType.DateChapterAdded: return (a.chapterLastAddedAt > b.chapterLastAddedAt ? 1 : -1) * flipOrder;
          case mio.OrderType.DateChapterRead: return (a.chapterLastReadAt > b.chapterLastReadAt ? 1 : -1) * flipOrder;
          default: return (a.metadata.title > b.metadata.title ? 1 : -1) * flipOrder;
        }
      }));
    } else {
      return this.props.application.series;
    }
  }
}
