import * as mio from '../';

export interface IApiChapter extends ISeriesChapter {
  pages: mio.IApiChapterPage[];
}
