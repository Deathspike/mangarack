import * as mio from '../default';

/**
 * Parses the location for the series identifier, chapter identifier and page number.
 * @return The series identifier, chapter identifier and page number.
 */
export function parseLocation(): {seriesId?: number, chapterId?: number, pageNumber?: number} {
  let match = window.location.hash.substr(1).match(/^\/([0-9]*)\/?([0-9]*)\/?([0-9]*)$/);
  return {
    chapterId: mio.option(match ? parseInt(match[2], 10) : NaN),
    pageNumber: mio.option(match ? parseInt(match[3], 10) : NaN),
    seriesId: mio.option(match ? parseInt(match[1], 10) : NaN)
  };
}
