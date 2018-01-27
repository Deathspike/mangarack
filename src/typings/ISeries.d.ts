interface ISeries<TItem extends ISeriesItem> {
  readonly artists: string[];
  readonly authors: string[];
  readonly items: TItem[];
  readonly genres: string[];
  readonly summary: string;
  readonly title: string;
  readonly type: string;
  readonly url: string;
}
