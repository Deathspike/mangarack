import * as mio from '../default';

/**
 * Represents a menu filter component.
 */
export class MenuFilterComponent extends mio.StatelessComponent<{menu: mio.IMenuState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuFilter">
        {(() => {
          switch(this.props.menu.type) {
            case mio.MenuType.Genre:
              return <mio.MenuFilterGenreComponent genres={this.props.menu.genres} />;
            default:
              return <mio.MenuFilterLinkComponent genres={this.props.menu.genres} />;
          }
        })()}
      </div>
    );
  }
}
