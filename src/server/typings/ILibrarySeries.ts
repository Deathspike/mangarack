import * as mio from '../';

export interface ILibrarySeries extends ISeries<mio.ILibrarySeriesItem> {
  readonly imageBase64: string;
}
