import * as mio from '../default';

/**
 * Represents an application controller.
 */
export class ApplicationController extends mio.StoreComponent<mio.IApplicationState> {
  /**
   * Initializes a new instance of the MainController class.
   */
  public constructor() {
    super(mio.store);
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <mio.SeriesController state={this.state.series} />
    );
  }
}
