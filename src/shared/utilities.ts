import * as sanitizeFilename from 'sanitize-filename';

export function format(value: number, wholeNumberLength: number) {
  let result = String(value);
  let index = result.indexOf('.');
  for (let i = wholeNumberLength - (index >= 0 ? index : result.length); i > 0; i--) result = '0' + result;
  return result;
}

export function nameOf(series: ISeries<ISeriesItem>, seriesItem: ISeriesItem) {
  let title = sanitizeFilename(series.title);
  if (title && typeof seriesItem.volume !== 'undefined') {
    return `${title} V${format(seriesItem.volume, 2)} #${format(seriesItem.number, 3)}`;
  } else if (title) {
    return `${title} #${format(seriesItem.number, 3)}`;
  } else {
    throw new Error('Invalid series item name');
  }
}
