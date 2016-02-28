import * as mio from '../default';

/**
 * Represents a menu filter genre item component.
 */
export class MenuFilterGenreItemComponent extends mio.StatelessComponent<{genre: mio.GenreType, genres: {[key: number]: boolean}}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let status = mio.option(this.props.genres[this.props.genre]);
    let displayName = mio.GenreType[this.props.genre].replace(/([a-z])([A-Z])/, '$1 $2');
    let className = status.hasValue ? (status.value ? 'fa-check-circle' : 'fa-times-circle') : 'fa-circle';
    return (
      <div className="menuFilterGenreItem" onClick={() => mio.menuActions.toggleFilterGenre(this.props.genre)}>
        <span className="text">{displayName}</span>
        <i className={`fa ${className}`}></i>
      </div>
    );
  }
}
