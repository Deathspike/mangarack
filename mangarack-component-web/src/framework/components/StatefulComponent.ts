/**
 * Represents a stateful component.
 */
export abstract class StatefulComponent<IProperties, IState> extends React.Component<IProperties, IState> {
  /**
   * Initializes a new instance of the StatefulComponent class.
   * @param properties The properties.
   * @param state The state.
   */
  public constructor(properties: IProperties, state: IState) {
    super(properties);
    this.state = state;
  }

  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    bind(this);
  }
}

/**
 * Binds the scope of each component function.
 * @param component The component.
 */
function bind(component: any): void {
  for (let key in component) {
    if (typeof component[key] === 'function') {
      component[key] = component[key].bind(component);
    }
  }
}
