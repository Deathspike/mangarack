import * as mio from '../default';

/**
 * Represents a filter component.
 */
export class FilterComponent extends mio.StatelessComponent<{filter: mio.IFilterState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="filter">
        {(() => {
          switch(this.props.filter.type) {
            case mio.FilterType.GenreType:
              return <mio.FilterGenreTypeListComponent filter={this.props.filter} />;
            default:
              /* TODO: Status filter (All/Read/Unread). */
              /* TODO: Series type filter. */
              return <mio.FilterLinkGenreTypeComponent />;
          }
        })()}
      </div>
    );
  }
}
