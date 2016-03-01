import * as mio from '../default';

/**
 * Represents a series list item preview component.
 */
export class SeriesListItemPreviewComponent extends mio.StatefulComponent<{id: number}, mio.IOption<string>> {
  /**
   * Initializes a new instance of the SeriesItemImageComponent class.
   * @param properties The properties.
   */
  public constructor(properties: {id: number}) {
    super(properties, mio.option<string>());
  }

  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    /* TODO: Implement lazy loading. */
    super.componentWillMount();
    this._loadPreviewImageAsync(this.props.id);
  }

  /**
   * Occurs when the component is in the process of being unmounted.
   */
  public componentWillUnmount(): void {
    this._clearPreviewImage();
  }

  /**
   * Occurs when the component is receiving properties.
   * @param newProperties The new properties.
   */
  public componentWillReceiveProps(newProperties: {id: number}) {
    if (this.props.id !== newProperties.id) {
      this._clearPreviewImage();
      this._loadPreviewImageAsync(newProperties.id);
    }
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="seriesListItemPreview">
        {(() => {
          if (this.state.hasValue) {
            return <img src={this.state.value} />;
          } else {
            return <div className="pending"><i className="fa fa-spin fa-circle-o-notch"></i></div>;
          }
        })()}
      </div>
    );
  }

  /**
   * Clears the image.
   */
  private _clearPreviewImage(): void {
    if (this.state.hasValue) {
      URL.revokeObjectURL(this.state.value);
      this.setState(mio.option<string>());
    }
  }

  /**
   * Promises to load the series preview image.
   * @param seriesId The series identifier.
   */
  private async _loadPreviewImageAsync(seriesId: number): Promise<void> {
    try {
      let blob = await mio.openActiveLibrary().imageAsync(seriesId);
      if (blob.hasValue) {
        this.setState(mio.option(URL.createObjectURL(blob.value)));
      } else {
        /* TODO: Placeholder missing image. */
      }
    } catch (error) {
      /* TODO: Placeholder failed-to-load image. */
    }
  }
}
