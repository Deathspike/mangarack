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
    let series = this._filterSeries();
    return (
      <div>
        <div id="header">
          <mio.HeaderBackComponent />
          {/* TODO: Download. */}
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
        for (var genre of series.metadata.genres) {
          if (menu.genres[genre] === false) {
            return false;
          }
        }
        for (var requiredGenre of requiredGenres) {
          if (series.metadata.genres.indexOf(requiredGenre) === -1) {
            return false;
          }
        }
        for (var searchTerm of searchTerms) {
          if (searchTerm && series.metadata.title.toLowerCase().indexOf(searchTerm) === -1) {
            return false;
          }
        }
        return true;
      }));
    } else {
      return this.props.application.series;
    }
  }

  /**
   * Promises to load the series.
   */
  private async _loadSeries(): Promise<void> {
    let series = await mio.openActiveLibrary().listAsync();
    mio.applicationActions.setSeries(series);
  }
}
