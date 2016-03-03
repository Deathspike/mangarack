import * as mio from '../default';

/**
 * Represents a menu select link component.
 */
export class MenuSelectLinkComponent extends mio.StatelessComponent<{menu: mio.IMenuState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuSelectLink">
        {/* TODO: Status filter (All/Read/Unread). */}
        <mio.MenuSelectLinkOrderComponent order={this.props.menu.order} />
        <mio.MenuSelectLinkGenreComponent genres={this.props.menu.genres} />
      </div>
    );
  }
}
