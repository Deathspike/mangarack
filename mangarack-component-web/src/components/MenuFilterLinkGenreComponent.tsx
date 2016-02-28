import * as mio from '../default';

/**
 * Represents a menu filter link genre component.
 */
export class MenuFilterLinkGenreComponent extends mio.StatelessComponent<void> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Show the number of genres filters active. */
    return (
      <div className="menuFilterLinkGenre" onClick={() => mio.menuActions.setMenuType(mio.MenuType.Genre)}>
        <span className="text">Genres</span>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  }
}
