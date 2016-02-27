import * as mio from '../default';

/**
 * Represents a stateless component.
 */
export abstract class StatelessComponent<IProperties> extends mio.StatefulComponent<IProperties, {}> {
  /**
   * Initializes a new instance of the StatelessComponent class.
   * @param properties The properties.
   */
  public constructor(properties: IProperties) {
    super(properties, {});
  }
}
