export interface ILibrarySeries extends ISeries<{
  exists?: boolean;
  number: number;
  title?: string;
  volume?: number;
}> {
  imageBase64: string;
}
