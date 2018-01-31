interface ISeries<T extends ISeriesChapter> {
  artists: string[];
  authors: string[];
  chapters: T[];
  genres: string[];
  name: string;
  summary: string;
  type: string;
  url: string;
}
