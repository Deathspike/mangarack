import * as mio from '../../default';

/**
 * Represents a HTML document.
 */
export interface IHtmlDocument {
  /**
   * Accepts the element which is then wrapped in an HTML object.
   * @param element The element to wrap in an object.
   * @return The HTML object.
   */
  (element: IHtmlElement): IHtmlObject;

  /**
   * Accepts the selector expression which is used to match a set of elements.
   * @param selector The string containing the selector expression.
   * @return The HTML object.
   */
  (selector: string): IHtmlObject;

  /**
   * Creates DOM elements from the provided string of raw HTML.
   * @param htmlString The string of raw HTML.
   * @return The HTML object.
   */
  (htmlString: string): IHtmlObject;
}

/**
 * Represents a HTML element.
 */
export interface IHtmlElement {}

/**
 * Represents a HTML object.
 */
export interface IHtmlObject {
  /**
   * Get the value of the attribute for the first element.
   * @param name The name of the attribute.
   * @return The value of the attribute for the first element.
   */
  attr(name: string): string;

  /**
   * Iterates over and executes the function for each element.
   * @param iterator The function that will be invoked for each element.
   * @return The current HTML object.
   */
  each(iterator: (index: number, element: IHtmlElement) => void): IHtmlObject;

  /**
   * Gets the descendants of each element filtered by the selector.
   * @param selector The string containing the selector expression.
   * @return The descendants of each element filtered by the selector.
   */
  find(selector: string): IHtmlObject;

  /**
   * Reduces the set to the first.
   * @return The set reduced to the first.
   */
  first(): IHtmlObject;

  /**
   * Gets the HTML contents of the first element.
   * @return The HTML contents of the first element.
   */
  html(): string;

  /**
   * Sets the HTML contents of each element.
   * @param htmlString The string of HTML to set as the content.
   * @return The current HTML object.
   */
  html(htmlString: string): IHtmlObject;

  /**
   * Passes each element through the function, mapping the result to a new object.
   * @param iterator The function that will be invoked for each element.
   * @return The result mapped to a new object.
   */
  map<T>(iterator: (index: number, element: IHtmlElement) => T): {get(): T[]}

  /**
   * Gets the immediately following sibling of each element.
   * @param selector= The string containing the selector expression.
   * @return The immediately following sibling of each element
   */
  next(selector: mio.IOption<string>): IHtmlObject;

  /**
   * Gets the parent of each element.
   * @param selector= The string containing the selector expression.
   * @return The parent of each element.
   */
  parent(selector: mio.IOption<string>): IHtmlObject;

  /**
   * Gets the immediately preceding sibling of each element.
   * @param selector? The string containing the selector expression.
   * @return The immediately preceding sibling of each element.
   */
  prev(selector: mio.IOption<string>): IHtmlObject;

  /**
   * Gets the text contents of each element, including their descendants.
   * @return The text contents of each element, including their descendants.
   */
  text(): string;
}

/**
 * Represents a HTML service.
 */
export interface IHtmlService {
  /**
   * Loads the string of raw HTML into a HTML document.
   * @param rawHtml The string of raw HTML.
   * @return The HTML document.
   */
  load(rawHtml: string): IHtmlDocument;
}
