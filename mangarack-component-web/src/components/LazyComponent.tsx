import * as mio from '../default';

/**
 * Represents a lozy component.
 */
export class LazyComponent extends mio.StatefulComponent<{className: string}, {isLoaded: boolean}> {
  private _element: HTMLElement;
  private _elementContainer?: HTMLElement;
  private _handler: () => void;
  private _isAttached = false;
  private _timeoutHandle = 0;
  private _updateTime = 0;

  /**
   * Initializes a new instance of the LazyLoadComponent class.
   */
  public constructor() {
    super(undefined, {isLoaded: false});
  }

  /**
   * Occurs when the component has mounted.
   */
  public componentDidMount(): void {
    this._element = ReactDOM.findDOMNode(this) as HTMLElement;
    this._elementContainer = findScrollableParent(this._element);
    this._handler = this._updateHandler.bind(this);
    this._handler();
    this._attachEventHandlers();
  }

  /**
   * Occurs when the component is in the process of being unmounted.
   */
  public componentWillUnmount(): void {
    this._detachEventHandlers();
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className={this.props.className} ref="self">
        {(() => {
          if (this.state.isLoaded) {
            return (this.props as any).children;
          } else {
            return null;
          }
        })()}
      </div>
    );
  }

  /**
   * Attaches each event handler.
   */
  private _attachEventHandlers(): void {
    if (!this._isAttached) {
      this._isAttached = true;
      if (this._elementContainer.hasValue) {
        this._elementContainer.value.addEventListener('scroll', this._handler);
        window.addEventListener('resize', this._handler);
      } else {
        window.addEventListener('scroll', this._handler)
        window.addEventListener('resize', this._handler);
      }
    }
  }

  /**
   * Detaches each event handler.
   */
  private _detachEventHandlers(): void {
    if (this._isAttached) {
      this._isAttached = false;
      if (this._elementContainer.hasValue) {
        this._elementContainer.value.removeEventListener('scroll', this._handler);
        window.removeEventListener('resize', this._handler);
      } else {
        window.removeEventListener('scroll', this._handler)
        window.removeEventListener('resize', this._handler);
      }
    }
  }

  /**
   * Updates the element loaded state when applicable.
   */
  private _update(): void {
    this._updateTime = Date.now();
    if (!this.state.isLoaded && !isHidden(this._element) && isInViewPort(this._element, this._elementContainer)) {
      this._detachEventHandlers();
      this.setState({isLoaded: true});
    }
  }

  /**
   * Occurs when the container is scrolled or when the window has resized.
   */
  private _updateHandler(): void {
    if (!this._timeoutHandle) {
      let elapsedTime = Date.now() - this._updateTime;
      let minimumTime = 250;
      if (elapsedTime >= minimumTime) {
        this._update();
      } else {
        this._timeoutHandle = setTimeout(() => {
          this._timeoutHandle = 0;
          this._update();
        }, minimumTime - elapsedTime);
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
  let regexp = /^auto|scroll$/;
  while (currentElement) {
    let style = getComputedStyle(currentElement);
    if (regexp.test(style.overflow) || regexp.test(style.overflowX) || regexp.test(style.overflowY)) {
      return mio.option(currentElement);
    } else {
      currentElement = currentElement.parentElement;
    }
  }
  return undefined;
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
 * @param container= The HTML container.
 * @return Indicates whether the element is in the viewport.
 */
function isInViewPort(element: HTMLElement, container?: HTMLElement): boolean {
  let containerTop = 0, containerRight = 0, containerBottom = 0, containerLeft = 0;
  let elementRectangle = element.getBoundingClientRect();
  let elementTop = elementRectangle.top + window.pageYOffset;
  let elementLeft = elementRectangle.left + window.pageXOffset;

  // Check if the container element is available.
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

  // Determine whether the element is in the viewport.
  return (
    containerTop <= elementTop + element.offsetHeight &&
    containerBottom >= elementTop &&
    containerLeft <= elementLeft + element.offsetWidth &&
    containerRight >= elementLeft
  );
}
