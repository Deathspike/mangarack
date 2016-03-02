import * as mio from '../default';

/**
 * Represents a series list item preview component.
 */
export class SeriesListItemPreviewComponent extends mio.StatefulComponent<{id: number}, mio.IOption<string>> {
  private _container: mio.IOption<HTMLElement>;
  private _element: HTMLElement;
  private _listener: () => void;

  /**
   * Initializes a new instance of the SeriesItemImageComponent class.
   * @param properties The properties.
   */
  public constructor(properties: {id: number}) {
    super(properties, mio.option<string>());
  }

  /**
   * Occurs when the component has mounted.
   */
  public componentDidMount(): void {
    this._element = (this.refs as any).preview.getDOMNode();
    this._container = findScrollableParent(this._element);
    this._listener = this._checkLazyLoad.bind(this);
    this._checkLazyLoad();
    if (this._container.hasValue) {
      this._container.value.addEventListener('scroll', this._listener);
      window.addEventListener('resize', this._listener);
    } else {
      window.addEventListener('scroll', this._listener)
      window.addEventListener('resize', this._listener);
    }
  }

  /**
   * Occurs when the component is in the process of being unmounted.
   */
  public componentWillUnmount(): void {
    this._clearPreviewImage();
    if (this._container.hasValue) {
      this._container.value.removeEventListener('scroll', this._listener);
      window.removeEventListener('resize', this._listener);
    } else {
      window.removeEventListener('scroll', this._listener)
      window.removeEventListener('resize', this._listener);
    }
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
      <div className="seriesListItemPreview" ref="preview">
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
   * Checks if the preview image should be lazy loaded.
   */
  private _checkLazyLoad(): void {
    if (!this.state.hasValue && !isHidden(this._element) && isInViewPort(this._element, this._container)) {
      this._loadPreviewImageAsync(this.props.id);
    }
  }

  /**
   * Clears the image.
   */
  private _clearPreviewImage(): void {
    if (this.state.hasValue) {
      this.setState(mio.option<string>());
    }
  }

  /**
   * Promises to load the series preview image.
   * @param seriesId The series identifier.
   */
  private async _loadPreviewImageAsync(seriesId: number): Promise<void> {
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

/**
 * Finds the scrollable parent.
 * @param element The element.
 * @return The scrollable parent.
 */
function findScrollableParent(element: HTMLElement): mio.IOption<HTMLElement> {
  let currentElement = element;
  let regex = /^auto|scroll$/;
  while (currentElement) {
    let style = getComputedStyle(currentElement);
    if (regex.test(style.overflow) || regex.test(style.overflowX) || regex.test(style.overflowY)) {
      return mio.option(currentElement);
    } else {
      currentElement = currentElement.parentElement;
    }
  }
  return mio.option<HTMLElement>();
}

/**
 * Determines whether the element is hidden.
 * @param element The element.
 * @return Indicates whether the element is hidden.
 */
function isHidden(element: HTMLElement): boolean {
  return element.offsetParent === null;
}

/**
 * Determines whether the element is in the viewport.
 * @param element The HTML element.
 * @param container The HTML container.
 * @return Indicates whether the element is in the viewport.
 */
function isInViewPort(element: HTMLElement, container: mio.IOption<HTMLElement>): boolean {
  let containerTop = 0;
  let containerRight = 0;
  let containerBottom = 0;
  let containerLeft = 0;
  let elementRectangle = element.getBoundingClientRect();
  let elementTop = elementRectangle.top + window.pageYOffset;
  let elementLeft = elementRectangle.left + window.pageXOffset;

  if (container.hasValue) {
    let containerRectangle = container.value.getBoundingClientRect();
    containerTop = containerRectangle.top + window.pageYOffset;
    containerLeft = containerRectangle.left + window.pageXOffset;
    containerBottom = containerTop + container.value.offsetHeight;
    containerRight = containerLeft + container.value.offsetWidth;
  } else {
    containerTop = window.pageYOffset;
    containerLeft = window.pageXOffset;
    containerBottom = containerTop + window.innerHeight;
    containerRight = containerLeft + window.innerWidth;
  }

  return (
    containerTop < elementTop + element.offsetHeight &&
    containerBottom > elementTop &&
    containerLeft < elementLeft + element.offsetWidth &&
    containerRight > elementLeft
  );
}
