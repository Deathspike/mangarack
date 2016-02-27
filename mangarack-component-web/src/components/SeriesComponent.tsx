import * as mio from '../default';

/**
 * Represents a series component.
 */
export class SeriesComponent extends mio.StatelessComponent<{series: mio.ILibrarySeries}> {
  private _imageUrl: mio.IOption<string>;

  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    super.componentWillMount();
    /* TODO: Implement lazy loading. */
    /* TODO: Implement visual indication for a pending image load. */
    this._imageUrl = mio.option<string>();
    this._loadImageAsync();
  }

  /**
   * Occurs when the component is in the process of being unmounted.
   */
  public componentWillUnmount(): void {
    if (this._imageUrl.hasValue) {
      URL.revokeObjectURL(this._imageUrl.value);
    }
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let numberOfUnreadChapters = this.props.series.numberOfChapters - this.props.series.numberOfReadChapters;
    return (
      <div className="series" key={this.props.series.id}>
        <div className="push"></div>
        <div className="contents">
          {numberOfUnreadChapters > 0 ? <span className="numberOfUnreadChapters">{numberOfUnreadChapters}</span> : null}
          <span className="title">{this.props.series.metadata.title}</span>
          <img className="previewImage" src={this._imageUrl.hasValue ? this._imageUrl.value : ''} />
          <span className="provider">{this.props.series.providerName}</span>
        </div>
      </div>
    );
  }

  /**
   * Promises to load the image.
   */
  private async _loadImageAsync(): Promise<void> {
    let blob = await mio.openActiveLibrary().imageAsync(this.props.series.id);
    if (blob.hasValue) {
      this._imageUrl = mio.option(URL.createObjectURL(blob.value));
      this.forceUpdate();
    }
  }
}
