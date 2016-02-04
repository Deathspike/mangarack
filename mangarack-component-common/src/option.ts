'use strict';
import * as mio from './default';

/**
 * Creates an option value.
 * @param value= The value, or null.
 * @return The option value.
 */
export function option<T>(value?: T): mio.IOption<T> {
  if (typeof value === 'boolean') {
    return {value: value};
  } else if (typeof value === 'number') {
    return {value: isFinite(<any>value) ? value : null};
  } else if (typeof value === 'undefined') {
    return {value: null};
  } else {
    return {value: value || null};
  }
}
