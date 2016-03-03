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
  setSearch: mio.store.reviser('MENU_SETSEARCH', function(state: mio.IApplicationState, search: string): void {
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
  toggleGenre: mio.store.reviser('MENU_TOGGLEGENRE', function(state: mio.IApplicationState, type: mio.GenreType): void {
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
  toggleOrder: mio.store.reviser('MENU_TOGGLEORDER', function(state: mio.IApplicationState, type: mio.OrderType): void {
    if (state.menu.order.type !== type) {
      state.menu.order.ascending = true;
      state.menu.order.type = type;
    } else {
      state.menu.order.ascending = !state.menu.order.ascending;
    }
  })
};
