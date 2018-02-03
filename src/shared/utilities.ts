import * as sanitizeFilename from 'sanitize-filename';

export function format(value: number, wholeNumberLength: number) {
  let result = String(value);
  let index = result.indexOf('.');
  for (let i = wholeNumberLength - (index >= 0 ? index : result.length); i > 0; i--) result = '0' + result;
  return result;
}

export function nameOf(series: ISeries<ISeriesChapter>, seriesChapter: ISeriesChapter) {
  let seriesName = sanitizeFilename(series.title);
  if (seriesName && typeof seriesChapter.volume !== 'undefined') {
    return `${seriesName} V${format(seriesChapter.volume, 2)} #${format(seriesChapter.number, 3)}`;
  } else if (seriesName) {
    return `${seriesName} #${format(seriesChapter.number, 3)}`;
  } else {
    throw new Error('Invalid series item name');
  }
}
