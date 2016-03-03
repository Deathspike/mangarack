import * as mio from '../default';

/**
 * Represents a menu view genre item component.
 */
export class MenuViewGenreItemComponent extends mio.StatelessComponent<{genres: {[key: number]: boolean}, type: mio.GenreType}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let status = mio.option(this.props.genres[this.props.type]);
    let displayName = mio.splitCamelCase(mio.GenreType[this.props.type]);
    let className = status.hasValue ? (status.value ? 'fa-check-circle' : 'fa-times-circle') : 'fa-circle';
    return (
      <div className="menuViewGenreItem" onClick={() => mio.menuActions.toggleGenre(this.props.type)}>
        <span className="text">{displayName}</span>
        <i className={`fa ${className}`}></i>
      </div>
    );
  }
}
