import * as mio from '../default';

/**
 * Represents a menu filter genre component.
 */
export class MenuFilterGenreComponent extends mio.StatelessComponent<{menu: mio.IMenuState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Limit to the genres currently in the library. */
    return (
      <div className="menuFilterGenre">
        {Object.keys(mio.GenreType)
          .map(key => parseInt(key, 10))
          .filter(key => isFinite(key))
          .map(genre => <mio.MenuFilterGenreItemComponent genre={genre} genres={this.props.menu.genres} />)}
      </div>
    );
  }
}
