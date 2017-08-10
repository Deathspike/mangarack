import * as mio from '../default';
const anySeriesType: {[key: string]: mio.SeriesType} = mio.SeriesType as any;

/**
 * Converts the string value to the series type, or the default series type.
 * @param value The value.
 * @return The series type.
 */
export function toSeriesType(value: string, defaultTo: mio.SeriesType): mio.SeriesType {
  return anySeriesType[value] || defaultTo;
}
