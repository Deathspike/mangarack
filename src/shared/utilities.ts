import * as sanitizeFilename from 'sanitize-filename';

export function format(value: number, wholeNumberLength: number) {
  let result = String(value);
  let index = result.indexOf('.');
  for (let i = wholeNumberLength - (index >= 0 ? index : result.length); i > 0; i--) result = '0' + result;
  return result;
}

export function nameOf(seriesTitle: string, seriesChapter: ISeriesChapter, skipPrefix?: boolean) { 
  let seriesName = sanitizeFilename(seriesTitle);
  let seriesPrefix = skipPrefix ? '' : seriesName + ' ';
  if (seriesName && typeof seriesChapter.volume !== 'undefined') {
    return `${seriesPrefix}V${format(seriesChapter.volume, 2)} #${format(seriesChapter.number, 3)}`;
  } else if (seriesName) {
    return `${seriesPrefix}#${format(seriesChapter.number, 3)}`;
  } else {
    throw new Error('Invalid series item name');
  }
}
