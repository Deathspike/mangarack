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
        <mio.MenuSelectLinkGenreComponent genres={this.props.menu.genres} />
        <mio.MenuSelectLinkOrderComponent order={this.props.menu.order} />
      </div>
    );
  }
}
