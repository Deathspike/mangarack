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
        <span className="text">Genres</span>
        <span className="minorText">{this.getMinorText() || 'No active filters.'}</span>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  }

  /**
   * Retrieves the minor text.
   * @return The minor text.
   */
  private getMinorText(): string {
    return Object.keys(this.props.genres)
      .map(key => parseInt(key, 10))
      .filter(key => isFinite(key))
      .reduce((p, c) => p + (p ? ', ' : '') + (this.props.genres[c] ? '+' : '-') + (mio.splitCamelCase(mio.GenreType[c])), '');
  }
}
