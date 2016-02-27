import * as mio from '../default';

/**
 * Represents a filter genre type link component.
 */
export class FilterLinkGenreTypeComponent extends mio.StatelessComponent<void> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="filterLink" onClick={() => mio.filterActions.setFilterType(mio.FilterType.GenreType)}>
        <i className="fa fa-angle-right"></i> Genres
      </div>
    );
  }
}
