interface ISeries<T extends ISeriesItem> {
  readonly artists: string[];
  readonly authors: string[];
  readonly items: T[];
  readonly genres: string[];
  readonly summary: string;
  readonly title: string;
  readonly type: string;
  readonly url: string;
}
