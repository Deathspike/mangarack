import * as mio from '../default';

/**
 * Represents a menu filter link component.
 */
export class MenuFilterLinkComponent extends mio.StatelessComponent<{genres: {[key: number]: boolean}}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuFilterLink">
        <div className="header">Filter</div>
        {/* TODO: Status filter (All/Read/Unread). */}
        {/* TODO: Series type filter. */}
        <mio.MenuFilterLinkGenreComponent genres={this.props.genres} />
      </div>
    );
  }
}
