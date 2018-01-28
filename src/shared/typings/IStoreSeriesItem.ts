export interface IStoreSeriesItem extends ISeriesItem {
  pages: {
    name: string,
    height: number,
    width: number
  }[];
}
