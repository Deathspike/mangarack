import * as fw from '../default';

/**
 * Represents a lazy map component.
 */
export class LazyMapComponent extends fw.StatelessComponent<{map: (item: any) => any, query: fw.ILazyQuery<any>, x?: number, y?: number}> {
  private _element: HTMLElement;
  private _elementChildren: HTMLElement[];
  private _elementContainer?: HTMLElement;
  private _handler: () => void;

  /**
   * Occurs when the component has mounted.
   */
  public componentDidMount(): void {
    this._element = ReactDOM.findDOMNode(this) as HTMLElement;
    this._elementChildren = [];
    this._elementContainer = findScrollableParent(this._element);
    this._handler = this._update.bind(this);
    if (!fw.isNull(this._elementContainer)) {
      this._update();
      this._elementContainer.addEventListener('scroll', this._handler);
      window.addEventListener('resize', this._handler);
    } else {
      this._update();
      window.addEventListener('scroll', this._handler);
      window.addEventListener('resize', this._handler);
    }
  }

  /**
   * Occurs when the component is receiving new properties.
   * @param props The new properties.
   */
  public componentWillReceiveProps(props: {query: fw.ILazyQuery<any>}): void {
    if (this.props.query !== props.query) {
      this._discardChildren();
    }
  }

  /**
   * Occurs when the component is receiving new properties.
   */
  public componentDidUpdate(): void {
    this._update();
  }

  /**
   * Occurs when the component is in the process of being unmounted.
   */
  public componentWillUnmount(): void {
    this._discardChildren();
    if (!fw.isNull(this._elementContainer)) {
      this._elementContainer.removeEventListener('scroll', this._handler);
      window.removeEventListener('resize', this._handler);
    } else {
      window.removeEventListener('scroll', this._handler);
      window.removeEventListener('resize', this._handler);
    }
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return <span></span>;
  }

  /**
   * Removes the child elements from the component.
   */
  private _discardChildren(): void {
    this._elementChildren.forEach(childContainer => ReactDOM.unmountComponentAtNode(childContainer));
    this._elementChildren = [];
  }

  /**
   * Updates the element loaded state when applicable.
   */
  private _update(): void {
    if (!isHidden(this._element)) {
      while (this.props.query.hasItem() && isEndInViewPort(this._element, this._elementContainer, this.props.x, this.props.y)) {
        let childComponent = this.props.map(this.props.query.getItem());
        let childContainer = document.createElement('div');
        ReactDOM.render(childComponent, childContainer);
        this._element.appendChild(childContainer);
        this._elementChildren.push(childContainer);
      }
    }
  }
}

/**
 * Finds the scrollable parent.
 * @param element The element.
 * @return The scrollable parent.
 */
function findScrollableParent(element: HTMLElement): HTMLElement | undefined {
  let currentElement = element;
  let test = (value: string) => /^auto|scroll$/.test(value || '');
  while (currentElement) {
    let style = getComputedStyle(currentElement);
    if (test(style.overflow || '') || test(style.overflowX || '') || test(style.overflowY || '')) {
      return currentElement;
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
  return fw.isNull(element.offsetParent);
}

/**
 * Determines whether the element end is in the viewport.
 * @param element The HTML element.
 * @param container The HTML container.
 * @param x= The offset on the x-axis.
 * @param y= The offset on the y-axis.
 * @return Indicates whether the element is in the viewport.
 */
function isEndInViewPort(element: HTMLElement, container: HTMLElement | undefined, x?: number, y?: number): boolean {
  let containerBottom = 0;
  let containerLeft = 0;
  let containerRight = 0;
  let containerTop = 0;
  let elementRectangle = element.getBoundingClientRect();
  let elementBottom = elementRectangle.bottom + window.pageYOffset - (y || 0);
  let elementRight = elementRectangle.right + window.pageXOffset - (x || 0);

  // Check if the container element is available.
  if (fw.isNull(container)) {
    containerTop = window.pageYOffset;
    containerLeft = window.pageXOffset;
    containerBottom = containerTop + window.innerHeight;
    containerRight = containerLeft + window.innerWidth;
  } else {
    let containerRectangle = container.getBoundingClientRect();
    containerTop = containerRectangle.top + window.pageYOffset;
    containerLeft = containerRectangle.left + window.pageXOffset;
    containerBottom = containerTop + container.offsetHeight;
    containerRight = containerLeft + container.offsetWidth;
  }

  // Determine if the end is in view.
  return elementBottom <= containerBottom && elementRight <= containerRight;
}
