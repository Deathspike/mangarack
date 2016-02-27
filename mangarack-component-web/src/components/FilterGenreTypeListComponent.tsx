import * as mio from '../default';

/**
 * Represents a filter genre type list component.
 */
export class FilterGenreTypeListComponent extends mio.StatelessComponent<{filter: mio.IFilterState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Limit to the genres currently in the library. */
    return (
      <div className="filterGenreTypeList">
        {Object.keys(mio.GenreType)
          .map(key => parseInt(key, 10))
          .filter(key => isFinite(key))
          .map(genreType => <mio.FilterGenreTypeComponent genreType={genreType} filter={this.props.filter} />)}
      </div>
    );
  }
}
