interface ISeries<T extends ISeriesItem> {
  artists: string[];
  authors: string[];
  items: T[];
  genres: string[];
  summary: string;
  title: string;
  type: string;
  url: string;
}
