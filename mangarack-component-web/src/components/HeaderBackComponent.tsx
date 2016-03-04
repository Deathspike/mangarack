import * as mio from '../default';

/**
 * Represents a header back component.
 */
export class HeaderBackComponent extends mio.StatelessComponent<void> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <i className="fa fa-chevron-left" onClick={() => mio.applicationActions.back()}></i>
    );
  }
}
