import * as mio from '../default';

export function processSeries(menu: mio.IMenuState, series: mio.IOption<mio.ILibrarySeries[]>): mio.IOption<mio.ILibrarySeries[]> {
  if (series.hasValue) {
    let requiredGenres = Object.keys(menu.genres).map(genre => parseInt(genre, 10)).filter(genre => menu.genres[genre] === true);
    let searchTerms = menu.search.split(/\s/).map(term => term.toLowerCase());
    return mio.option(series.value.filter(series => {
      for (let genre of series.metadata.genres) {
        if (menu.genres[genre] === false) {
          return false;
        }
      }
      for (let requiredGenre of requiredGenres) {
        if (series.metadata.genres.indexOf(requiredGenre) === -1) {
          return false;
        }
      }
      for (let searchTerm of searchTerms) {
        if (searchTerm && series.metadata.title.toLowerCase().indexOf(searchTerm) === -1) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      let flipOrder = menu.order.ascending ? 1 : -1;
      switch (menu.order.type) {
        case mio.OrderType.DateSeriesAdded: return (a.addedAt > b.addedAt ? 1 : -1) * flipOrder;
        case mio.OrderType.DateChapterAdded: return (a.chapterLastAddedAt > b.chapterLastAddedAt ? 1 : -1) * flipOrder;
        case mio.OrderType.DateChapterRead: return (a.chapterLastReadAt > b.chapterLastReadAt ? 1 : -1) * flipOrder;
        default: return (a.metadata.title > b.metadata.title ? 1 : -1) * flipOrder;
      }
    }));
  } else {
    return series;
  }
}
