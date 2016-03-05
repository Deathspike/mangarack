import * as mio from '../default';

/**
 * Represents each menu action.
 * @internal
 */
export let menuActions = {
  /**
   * Sets the search.
   * @param search The search.
   */
  setSearch: wrapReviser('MENU_SETSEARCH', function(state: mio.IApplicationState, search: string): void {
    state.menu.search = search;
  }),

  /**
   * Sets the type.
   * @param revisor The menu type.
   */
  setType: mio.store.reviser('MENU_SETTYPE', function(state: mio.IApplicationState, type: mio.MenuType): void {
    state.menu.type = type;
  }),

  /**
   * Toggles the genre type.
   * @param revisor The genre type.
   */
  toggleGenre: wrapReviser('MENU_TOGGLEGENRE', function(state: mio.IApplicationState, type: mio.GenreType): void {
    let genres = state.menu.genres;
    if (genres[type] == null) {
      genres[type] = true;
    } else if (genres[type]) {
      genres[type] = false;
    } else {
      delete genres[type];
    }
  }),

  /**
   * Toggles the order.
   * @param order The order.
   */
  toggleOrder: wrapReviser('MENU_TOGGLEORDER', function(state: mio.IApplicationState, type: mio.OrderType): void {
    if (state.menu.order.type !== type) {
      state.menu.order.ascending = true;
      state.menu.order.type = type;
    } else {
      state.menu.order.ascending = !state.menu.order.ascending;
    }
  })
};

/**
 * Wraps the reviser in a series processor.
 * @param name The name.
 * @param reviser The reviser.
 * @return The wrapped reviser.
 */
function wrapReviser<T>(name: string, reviser: mio.IStoreReviserWithParameter<mio.IApplicationState, T>): (revision: T) => void {
  return mio.store.reviser(name, function(state: mio.IApplicationState, revision: T): void {
    reviser(state, revision);
    state.series.processed = mio.processSeries(state.menu, state.series.all);
  });
}
