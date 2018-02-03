interface ISeries<T extends ISeriesChapter> {
  artists: string[];
  authors: string[];
  chapters: T[];
  genres: string[];
  summary: string;
  title: string;
  type: string;
  url: string;
}
