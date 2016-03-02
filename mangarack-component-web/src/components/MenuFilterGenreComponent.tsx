import * as mio from '../default';

/**
 * Represents a menu filter genre component.
 */
export class MenuFilterGenreComponent extends mio.StatelessComponent<{genres: {[key: number]: boolean}}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Add a 'reset all' button. */
    return (
      <div className="menuFilterGenre">
        {Object.keys(mio.GenreType)
          .map(key => parseInt(key, 10))
          .filter(key => isFinite(key))
          .map(genre => <mio.MenuFilterGenreItemComponent genre={genre} genres={this.props.genres} />)}
      </div>
    );
  }
}
