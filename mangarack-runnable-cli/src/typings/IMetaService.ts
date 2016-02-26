import * as mio from '../default';

/**
 * Represents the meta service.
 */
export interface IMetaService {
  /**
   * Creates meta data and converts it to a xml document.
   * @param series The series.
   * @param chapter The chapter.
   * @param pages Each page.
   * @return The xml document.
   */
  createXml: (series: mio.ISeries, chapter: mio.IChapter, pages: mio.IPage[]) => string;
}
