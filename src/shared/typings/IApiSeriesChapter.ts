export interface IApiSeriesChapter extends ISeriesChapter {
  available: boolean;
  downloaded: boolean;
  number: number;
  volume?: number;
}
