export interface IProviderIterator {
  closeAsync(): Promise<void>;
  currentAsync(): Promise<Buffer>;
  moveAsync(): Promise<boolean>;
}
