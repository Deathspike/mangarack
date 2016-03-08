import * as mio from '../default';

/**
 * Represents a menu view genre component.
 */
export class MenuViewGenreComponent extends mio.StatelessComponent<{genres: {[key: number]: boolean}}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuViewGenre">
        {Object.keys(mio.GenreType)
          .map(key => parseInt(key, 10))
          .filter(key => isFinite(key))
          .map(type => <mio.MenuViewGenreItemComponent genres={this.props.genres} type={type} />)}
      </div>
    );
  }
}
