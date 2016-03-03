import * as mio from '../default';

/**
 * Represents a menu select link genre component.
 */
export class MenuSelectLinkGenreComponent extends mio.StatelessComponent<{genres: {[key: number]: boolean}}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuSelectLinkGenre" onClick={() => mio.menuActions.setType(mio.MenuType.Genre)}>
        {(() => {
          let numberOfGenreFilters = Object.keys(this.props.genres).length;
          if (numberOfGenreFilters > 0) {
            return <span className="numberOfGenreFilters">{numberOfGenreFilters}</span>;
          } else {
            return null;
          }
        })()}
        <span className="text">Filter Genres</span>
        <span className="subtext">{this._getVisualizedGenreFilters()}</span>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  }

  /**
   * Retrieves the visualized genre filters.
   * @return The visaluzed genre filters.
   */
  private _getVisualizedGenreFilters(): string {
    return Object.keys(this.props.genres)
      .map(key => parseInt(key, 10))
      .filter(key => isFinite(key))
      .reduce((p, c) => p + (p ? ', ' : '') + (this.props.genres[c] ? '+' : '-') + (mio.splitCamelCase(mio.GenreType[c])), '');
  }
}
