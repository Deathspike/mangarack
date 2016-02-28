import * as mio from '../default';

/**
 * Represents each menu action.
 * @internal
 */
export let menuActions = {
  /**
   * Sets the menu type.
   * @param revisor The filter type.
   */
  setMenuType: mio.store.reviser('MENU_SETTYPE', function(state: mio.IApplicationState, type: mio.MenuType): void {
    state.menu.type = type;
  }),

  /**
   * Toggles the genre type.
   * @param revisor The genre type.
   */
  toggleFilterGenre: mio.store.reviser('MENU_TOGGLEFILTERGENRE', function(state: mio.IApplicationState, genre: mio.GenreType): void {
    let genres = state.menu.genres;
    if (genres[genre] == null) {
      genres[genre] = true;
    } else if (genres[genre]) {
      genres[genre] = false;
    } else {
      delete genres[genre];
    }
  })
};
