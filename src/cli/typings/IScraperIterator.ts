export interface IScraperIterator {
  closeAsync(): Promise<void>;
  currentAsync(): Promise<Buffer>;
  moveAsync(): Promise<boolean>;
}
