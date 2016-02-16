'use strict';
import * as mio from './default';
import * as xml2js from 'xml2js';

/**
 * Represents meta data functionality.
 */
export let meta = {
  /**
   * Creates meta data and converts it to a xml document.
   * @param series The series.
   * @param chapter The chapter.
   * @param pages Each page.
   * @return The xml document.
   */
  createXml: function(series: mio.ISeries, chapter: mio.IChapter, pages: mio.IPage[]): string {
    return new xml2js.Builder({
      rootName: 'ComicInfo',
      xmldec: {version: '1.0', encoding: 'utf-8'}
    }).buildObject(titleCase({
      genres: series.genres.map(genre => mio.GenreType[genre].replace(/([a-z])([A-Z])/g, '$1 $2')).join(', '),
      manga: series.type === mio.SeriesType.Manga ? 'YesAndRightToLeft' : '',
      number: chapter.number.hasValue ? String(chapter.number.value) : '',
      pages: {page: [{image: 0, type: 'FrontCover'}].concat(pages.map(page => ({image: page.number, type: ''})))},
      penciller: series.artists.join(', '),
      series: series.title,
      summary: series.summary,
      title: chapter.title,
      volume: chapter.volume.hasValue ? String(chapter.volume.value) : '',
      writer: series.authors.join(', ')
    }));
  }
};

/**
 * Creates an object with each key converted to title case.
 * @param item The item.
 * @return The object with each key converted to title case.
 */
function titleCase(item: any): any {
  let result: any = Array.isArray(item) ? [] : {};
  for (let key in item) {
    let value = item[key];
    if (item.hasOwnProperty(key) && value != null) {
      let title = key.charAt(0).toUpperCase() + key.substr(1);
      result[title] = typeof value === 'object' ? titleCase(value) : value;
    }
  }
  return result;
}
