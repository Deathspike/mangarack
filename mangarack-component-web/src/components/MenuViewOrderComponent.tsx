import * as mio from '../default';

/**
 * Represents a menu view order component.
 */
export class MenuViewOrderComponent extends mio.StatelessComponent<{order: mio.IMenuOrderState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuViewOrder">
        {Object.keys(mio.OrderType)
          .map(key => parseInt(key, 10))
          .filter(key => isFinite(key))
          .map(type => <mio.MenuViewOrderItemComponent order={this.props.order} type={type} />)}
      </div>
    );
  }
}
