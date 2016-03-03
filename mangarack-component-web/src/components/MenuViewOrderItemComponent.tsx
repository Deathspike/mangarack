import * as mio from '../default';

/**
 * Represents a menu view order item component.
 */
export class MenuViewOrderItemComponent extends mio.StatelessComponent<{order: mio.IMenuOrderState, type: mio.OrderType}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let isSelected = this.props.order.type === this.props.type;
    let displayName = mio.splitCamelCase(mio.OrderType[this.props.type]);
    let className = isSelected ? (this.props.order.ascending ? 'fa-arrow-circle-up' : 'fa-arrow-circle-down') : 'fa-circle';
    return (
      <div className="menuViewOrderItem" onClick={() => mio.menuActions.toggleOrder(this.props.type)}>
        <span className="text">{displayName}</span>
        <i className={`fa ${className}`}></i>
      </div>
    );
  }
}
