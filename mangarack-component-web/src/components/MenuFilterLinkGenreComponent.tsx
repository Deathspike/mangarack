import * as mio from '../default';

/**
 * Represents a menu filter link genre component.
 */
export class MenuFilterLinkGenreComponent extends mio.StatelessComponent<{genres: {[key: number]: boolean}}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let numberOfGenreFilters = Object.keys(this.props.genres).length;
    return (
      <div className="menuFilterLinkGenre" onClick={() => mio.menuActions.setMenuType(mio.MenuType.Genre)}>
        {(() => {
          if (numberOfGenreFilters > 0) {
            return <span className="numberOfGenreFilters">{numberOfGenreFilters}</span>;
          } else {
            return null;
          }
        })()}
        <span className="text">Genres</span>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  }
}
