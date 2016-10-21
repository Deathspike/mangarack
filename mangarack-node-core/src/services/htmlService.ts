import * as cheerio from 'cheerio';
import * as mio from '../default';

/**
 * Represents a HTML service.
 * @internal
 */
export let htmlService: mio.IHtmlService = {
  /**
   * Loads the string of raw HTML into a HTML document.
   * @param rawHtml The string of raw HTML.
   * @return The HTML document.
   */
  load: function(rawHtml: string): mio.IHtmlServiceDocument {
    return encapsulateDocument(cheerio.load(rawHtml));
  }
};

/**
 * Encapsulates the object which represents a HTML document.
 * @param cheerioStatic The object.
 * @return The HTML object.
 */
function encapsulateDocument(cheerioStatic: CheerioStatic): (elementOrSelector: mio.IHtmlServiceElement | string) => mio.IHtmlServiceObject {
  return elementOrSelector => encapsulateObject(cheerioStatic(elementOrSelector));
}

/**
 * Encapsulates the object which represents a HTML object.
 * @param cheerioObject The object.
 * @return The HTML object.
 */
function encapsulateObject(cheerioObject: Cheerio): mio.IHtmlServiceObject {
  return {
    /**
     * Get the value of the attribute for the first element.
     * @param name The name of the attribute.
     * @return The value of the attribute for the first element.
     */
    attr: function(name: string): string {
      return (cheerioObject.attr(name) || '').trim();
    },

    /**
     * Iterates over and executes the function for each element.
     * @param iterator The function that will be invoked for each element.
     * @return The current HTML object.
     */
    each: function(iterator: (index: number, element: mio.IHtmlServiceElement) => void): mio.IHtmlServiceObject {
      cheerioObject.each((index, element) => iterator(index, mio.unsafe<mio.IHtmlServiceElement>(element)));
      return encapsulateObject(cheerioObject);
    },

    /**
     * Gets the descendants of each element filtered by the selector.
     * @param selector The string containing the selector expression.
     * @return The descendants of each element filtered by the selector.
     */
    find: function(selector: string): mio.IHtmlServiceObject {
      return encapsulateObject(cheerioObject.find(selector));
    },

    /**
     * Reduces the set to the first.
     * @return The set reduced to the first.
     */
    first: function(): mio.IHtmlServiceObject {
      return encapsulateObject(cheerioObject.first());
    },

     /**
      * Gets the HTML contents of the first element, or sets the HTML contents of each element.
      * @param htmlString= The string of HTML to set as the content.
      * @return The current HTML object.
      */
    html: function(htmlString?: string): any {
      return typeof htmlString === 'string'
        ? encapsulateObject(cheerioObject.html(htmlString))
        : cheerioObject.html();
    },

    /**
     * Passes each element through the function, mapping the result to a new object.
     * @param iterator The function that will be invoked for each element.
     * @return The result mapped to a new object.
     */
    map: function<T>(iterator: (index: number, element: mio.IHtmlServiceElement) => T): {get(): T[]} {
      return {get: () => cheerioObject.map((index, element) => iterator(index, mio.unsafe<mio.IHtmlServiceElement>(element))).get() as any};
    },

    /**
     * Gets the immediately following sibling of each element.
     * @param selector= The string containing the selector expression.
     * @return The immediately following sibling of each element
     */
    next: function(selector?: string): mio.IHtmlServiceObject {
      return encapsulateObject(typeof selector === 'string'
        ? cheerioObject.next(selector)
        : cheerioObject.next());
    },

    /**
     * Gets the parent of each element.
     * @param selector= The string containing the selector expression.
     * @return The parent of each element.
     */
    parent: function(selector?: string): mio.IHtmlServiceObject {
      return encapsulateObject(typeof selector === 'string'
        ? cheerioObject.parent(selector)
        : cheerioObject.parent());
    },

    /**
     * Gets the immediately preceding sibling of each element.
     * @param selector= The string containing the selector expression.
     * @return The immediately preceding sibling of each element.
     */
    prev: function(selector?: string): mio.IHtmlServiceObject {
      return encapsulateObject(typeof selector === 'string'
        ? cheerioObject.prev(selector)
        : cheerioObject.prev());
    },

    /**
     * Gets the text contents of each element, including their descendants.
     * @return The text contents of each element, including their descendants.
     */
    text: function(): string {
      return (cheerioObject.text() || '').trim();
    }
  };
}
