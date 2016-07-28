import * as mio from '../default';

/**
 * Represents the application state.
 */
export interface IApplicationState {
  /**
   * Contains each chapter.
   */
  chapters?: mio.ILibraryChapter[];

  /**
   * Contains the menu state.
   */
  menu: mio.IMenuState;

  /**
   * Contains the modal state.
   */
  modal: mio.IModalState;

  /**
   * Contains each series.
   */
  series: {all?: mio.ILibrarySeries[], processed?: mio.ILibrarySeries[]};
}
