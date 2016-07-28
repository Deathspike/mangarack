import * as mio from '../default';

/**
 * Processes the series according to the menu state.
 * @param menu The menu state.
 * @param series The series.
 * @return The processed series.
 */
export function processSeries(menu: mio.IMenuState, series?: mio.ILibrarySeries[]): mio.IOption<mio.ILibrarySeries[]> {
  if (series.hasValue) {
    let requiredGenres = Object.keys(menu.genres).map(genre => parseInt(genre, 10)).filter(genre => menu.genres[genre] === true);
    let searchTerms = menu.search.split(/\s/).map(term => term.toLowerCase());
    return mio.option(series.value.filter(item => {
      for (let genre of item.metadata.genres) {
        if (menu.genres[genre] === false) {
          return false;
        }
      }
      for (let requiredGenre of requiredGenres) {
        if (item.metadata.genres.indexOf(requiredGenre) === -1) {
          return false;
        }
      }
      for (let searchTerm of searchTerms) {
        if (searchTerm && item.providerName.toLowerCase().indexOf(searchTerm) === -1 && item.metadata.title.toLowerCase().indexOf(searchTerm) === -1) {
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
        default:
          if (a.metadata.title === b.metadata.title) {
            return (a.providerName > b.providerName ? 1 : -1) * flipOrder;
          } else {
            return (a.metadata.title > b.metadata.title ? 1 : -1) * flipOrder;
          }
      }
    }));
  } else {
    return series;
  }
}
