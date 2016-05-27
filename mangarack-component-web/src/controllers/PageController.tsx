import * as mio from '../default';

/**
 * Represents a page controller.
 */
export class PageController extends mio.StatelessComponent<{application: mio.IApplicationState, chapterId: number, pageNumber: number, seriesId: number}> {
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
    // image processing
    // touch + zoom
    // forward/backward
    // status displays
    // menu controls.
    // direction (ltr, rtl, webtoon)

    /* TODO: Be sure to check if the menu component is actually unmounted on mobile. It probably isn't causing unnecessary rendering. */
    return (
      <span>
        <mio.MenuComponent controller="page" menu={this.props.application.menu} series={this.props.application.series.processed} />
        <span>Hi from page!</span>
      </span>
    );
  }
}
