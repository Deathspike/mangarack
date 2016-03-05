import * as mio from '../default';

/**
 * Represents a chapter controller.
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
    /* TODO: Be sure to check if the menu component is actually unmounted on mobile. It probably isn't causing unnecessary rendering. */
    return (
      <span>
        <mio.MenuComponent controller="chapters" menu={this.props.application.menu} series={this.props.application.series.processed} />
        <mio.ChapterComponent chapters={this.props.application.chapters} series={this.props.application.series.all} seriesId={this.props.seriesId} />
      </span>
    );
  }
}
