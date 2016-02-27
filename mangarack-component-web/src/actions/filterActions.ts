import * as mio from '../default';

/**
 * Represents each filter action.
 * @internal
 */
export let filterActions = {
  /**
   * Sets the filter type.
   * @param revisor The filter type.
   */
  setFilterType: mio.store.reviser('FILTER_SETTYPE', function(state: mio.IApplicationState, filterType: mio.FilterType): void {
    state.filter.type = filterType;
  }),

  /**
   * Toggles the genre type.
   * @param revisor The genre type.
   */
  toggleGenreType: mio.store.reviser('FILTER_TOGGLEGENRETYPE', function(state: mio.IApplicationState, genreType: mio.GenreType): void {
    let genres = state.filter.genres;
    if (genres[genreType] == null) {
      genres[genreType] = true;
    } else if (genres[genreType]) {
      genres[genreType] = false;
    } else {
      genres[genreType] = null;
    }
  })
};
