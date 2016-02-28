import * as mio from '../default';
export type SeriesItemComponentProperties = {series: mio.ILibrarySeries};
export type SeriesItemComponentState = {imageUrl: mio.IOption<string>};

/**
 * Represents a series item component.
 */
export class SeriesItemComponent extends mio.StatefulComponent<SeriesItemComponentProperties, SeriesItemComponentState> {
  /**
   * Initializes a new instance of the StatefulComponent class.
   * @param properties The properties.
   */
  public constructor(properties: SeriesItemComponentProperties) {
    super(properties, {imageUrl: mio.option<string>()});
  }

  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    /* TODO: Implement lazy loading. */
    /* TODO: Implement visual indication for a pending image load. */
    super.componentWillMount();
    this._loadImageAsync(this.props.series.id);
  }

  /**
   * Occurs when the component is in the process of being unmounted.
   */
  public componentWillUnmount(): void {
    this._clearImage();
  }

  /**
   * Occurs when the component is receiving properties.
   * @param newProperties The new properties.
   */
  public componentWillReceiveProps(newProperties: SeriesItemComponentProperties) {
    if (this.props.series.id !== newProperties.series.id) {
      this._clearImage();
      this.setState({imageUrl: mio.option<string>()});
      this._loadImageAsync(newProperties.series.id);
    }
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let numberOfUnreadChapters = this.props.series.numberOfChapters - this.props.series.numberOfReadChapters;
    return (
      <div className="seriesItem" key={this.props.series.id}>
        <div className="push"></div>
        <div className="seriesItemBody">
          {numberOfUnreadChapters > 0 ?
            <span className="numberOfUnreadChapters">{numberOfUnreadChapters}</span> :
            null}
          <span className="title">{this.props.series.metadata.title}</span>
          <img className="previewImage" src={this.state.imageUrl.hasValue ? this.state.imageUrl.value : ''} />
          <span className="provider">{this.props.series.providerName}</span>
        </div>
      </div>
    );
  }

  /**
   * Clears the image.
   */
  private _clearImage(): void {
    if (this.state.imageUrl.hasValue) {
      URL.revokeObjectURL(this.state.imageUrl.value);
    }
  }

  /**
   * Promises to load the image.
   * @param seriesId The series identifier.
   */
  private async _loadImageAsync(seriesId: number): Promise<void> {
    let blob = await mio.openActiveLibrary().imageAsync(seriesId);
    if (blob.hasValue) {
      this.setState({imageUrl: mio.option(URL.createObjectURL(blob.value))});
    }
  }
}
