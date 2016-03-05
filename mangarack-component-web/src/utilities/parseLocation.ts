import * as mio from '../default';

/**
 * Parses the location for the series identifier, chapter identifier and page number.
 * @return The series identifier, chapter identifier and page number.
 */
export function parseLocation(): {seriesId: mio.IOption<number>, chapterId: mio.IOption<number>, pageNumber: mio.IOption<number>} {
  let match = window.location.hash.substr(1).match(/^\/([0-9]*)\/?([0-9]*)\/?([0-9]*)$/);
  return {
    seriesId: mio.option(match ? parseInt(match[1], 10) : NaN),
    chapterId: mio.option(match ? parseInt(match[2], 10) : NaN),
    pageNumber: mio.option(match ? parseInt(match[3], 10) : NaN)
  };
}
