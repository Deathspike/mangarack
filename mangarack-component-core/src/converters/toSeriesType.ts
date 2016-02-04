'use strict';
import * as mio from '../default';
let anySeriesType: {[key: string]: mio.SeriesType} = <any>mio.SeriesType;

/**
 * Converts the string value to a series type, or the default series type.
 * @param value The value.
 * @return The series type.
 */
export function toSeriesType(value: string, defaultTo: mio.SeriesType):  mio.SeriesType {
  return anySeriesType[value] || defaultTo;
}
