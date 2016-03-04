import * as mio from '../default';

/**
 * Represents a series image component.
 */
export class SeriesImageComponent extends mio.StatefulComponent<{id: number}, mio.IOption<string>> {
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
    super.componentWillMount();
    this._loadImageAsync(this.props.id);
  }

  /**
   * Occurs when the component is receiving properties.
   * @param newProperties The new properties.
   */
  public componentWillReceiveProps(newProperties: {id: number}) {
    if (this.props.id !== newProperties.id) {
      this._clearImage();
      this._loadImageAsync(newProperties.id);
    }
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    if (this.state.hasValue) {
      return <img src={this.state.value} />;
    } else {
      return <i className="fa fa-spin fa-circle-o-notch"></i>;
    }
  }

  /**
   * Clears the series image.
   */
  private _clearImage(): void {
    if (this.state.hasValue) {
      this.setState(mio.option<string>());
    }
  }

  /**
   * Promises to load the series image.
   * @param seriesId The series identifier.
   */
  private async _loadImageAsync(seriesId: number): Promise<void> {
    if (mio.cache[seriesId]) {
      this.setState(mio.option(mio.cache[seriesId]));
    } else {
      try {
        let blob = await mio.openActiveLibrary().imageAsync(seriesId);
        if (blob.hasValue) {
          let url = URL.createObjectURL(blob.value);
          mio.cache[seriesId] = url;
          this.setState(mio.option(url));
        } else {
          /* TODO: Placeholder missing image. */
        }
      } catch (error) {
        /* TODO: Placeholder failed-to-load image. */
      }
    }
  }
}
