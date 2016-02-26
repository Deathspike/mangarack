import * as mio from '../default';

/**
 * Represents the download service.
 */
export interface IDownloadService {
  /**
   * Promises to download the chapter.
   * @param provider The provider.
   * @param series The series.
   * @param seriesPreviewImage The series preview image.
   * @param chapter The chapter.
   * @return The promise to download the chapter.
   */
  chapterAsync: (provider: mio.IProvider, series: mio.ISeries, seriesPreviewImage: mio.IBlob, chapter: mio.IChapter) => Promise<void>;

  /**
   * Promises to download the pages.
   * @param provider The provider.
   * @param series The series.
   * @param seriesPreviewImage The series preview image.
   * @param chapter The chapter.
   * @param pages The pages.
   * @return The promise to download the pages.
   */
  pagesAsync: (provider: mio.IProvider, series: mio.ISeries, seriesPreviewImage: mio.IBlob, chapter: mio.IChapter, pages: mio.IPage[]) => Promise<void>;

  /**
   * Promises to download the series.
   * @param address The address.
   * @return The promise to download the series.
   */
  seriesAsync: (address: string) => Promise<void>;
}
