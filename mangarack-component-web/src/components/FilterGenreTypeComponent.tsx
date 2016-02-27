import * as mio from '../default';

/**
 * Represents a filter genre type component.
 */
export class FilterGenreTypeComponent extends mio.StatelessComponent<{genreType: mio.GenreType, filter: mio.IFilterState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let status = mio.option(this.props.filter.genres[this.props.genreType]);
    let displayName = mio.GenreType[this.props.genreType].replace(/([a-z])([A-Z])/, '$1 $2');
    let className = status.hasValue ? (status.value ? 'fa-check-circle' : 'fa-times-circle') : 'fa-circle';
    return (
      <div className="filterGenreType" onClick={() => mio.filterActions.toggleGenreType(this.props.genreType)}>
        <span className="title">{displayName}</span>
        <i className={`fa ${className}`}></i>
      </div>
    );
  }
}
