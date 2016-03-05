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
        <div className="direction">{this.props.order.ascending ? 'asc' : 'dsc'}</div>
        <div className="text">Order By</div>
        <div className="minorText">{displayName}</div>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  }
}
