import * as mio from '../default';

/**
 * Represents a menu select component.
 */
export class MenuSelectComponent extends mio.StatelessComponent<{menu: mio.IMenuState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuSelect">
        {(() => {
          switch (this.props.menu.type) {
            case mio.MenuType.Genre:
              return <mio.MenuViewGenreComponent genres={this.props.menu.genres} />;
            case mio.MenuType.Order:
              return <mio.MenuViewOrderComponent order={this.props.menu.order} />;
            default:
              return (
                <span>
                  <mio.MenuSelectSearchComponent search={this.props.menu.search} />
                  <mio.MenuSelectLinkComponent menu={this.props.menu} />
                </span>
              );
          }
        })()}
      </div>
    );
  }
}
