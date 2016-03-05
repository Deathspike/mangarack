import * as mio from '../default';

/**
 * Represents a chapters controller.
 */
export class ChapterController extends mio.StatelessComponent<{application: mio.IApplicationState, seriesId: number}> {
  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    super.componentWillMount();
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /*Plan:
      Series:
        Desktop: Menu + Series. Menu DOES NOT have control buttons.
        Mobile: Menu
      Chapter:
        Desktop: Menu + Chapters. Menu DOES have control buttons. Menu can still be used to do quick navigation.
        Mobile: Chapters (no menu!)
      Pages
        Desktop: Menu + Pages. Menu DOES have control buttons. Menu can still be used to do quick navigation.
        Mobile: Pages (no menu!)
    */

    // Be sure to check if the menu component is actually unmounted on mobile. It probably isn't causing unnecessary rendering.
    if (!this.props.application.series.processed.hasValue) {
      return null;
    } else {
      return (
        <div>
          <div id="header">
            <mio.HeaderBackComponent />
            <span className="title">MangaRack</span>
          </div>
          <div id="container">
            <mio.MenuComponent menu={this.props.application.menu} series={this.props.application.series.processed} />
            Here be dragons for {this.props.seriesId}
          </div>
        </div>
      );
    }
  }
}
