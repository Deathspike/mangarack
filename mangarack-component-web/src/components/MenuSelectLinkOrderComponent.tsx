import * as mio from '../default';

/**
 * Represents a menu select link order component.
 */
export class MenuSelectLinkOrderComponent extends mio.StatelessComponent<{order: mio.IMenuOrderState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let displayName = mio.splitCamelCase(mio.OrderType[this.props.order.type]);
    return (
      <div className="menuSelectLinkOrder" onClick={() => mio.menuActions.setType(mio.MenuType.Order)}>
        <span className="direction">{this.props.order.ascending ? 'asc' : 'dsc'}</span>
        <span className="text">Order By</span>
        <span className="minorText">{displayName}</span>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  }
}
