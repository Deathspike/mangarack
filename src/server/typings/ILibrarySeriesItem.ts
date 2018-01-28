export interface ILibrarySeriesItem extends ISeriesItem {
  pages: {
    name: string,
    height: number,
    width: number
  }[];
}
