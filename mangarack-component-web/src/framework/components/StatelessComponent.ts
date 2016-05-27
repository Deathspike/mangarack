import * as fw from '../default';

/**
 * Represents a stateless component.
 */
export abstract class StatelessComponent<IProperties> extends fw.StatefulComponent<IProperties, void> {
  /**
   * Initializes a new instance of the StatelessComponent class.
   * @param properties The properties.
   */
  public constructor(properties: IProperties) {
    super(properties, undefined);
  }
}
