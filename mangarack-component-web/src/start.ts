import * as mio from './default';
/* TODO: Check the bind mechanism. I'm doing binds where it should not be necessary.. */
/* TODO: Allow local connections without caring for the password. */
/* TODO: If HDD is unreachable.. bleh. */

/* TODO: Move this somewhere a little more sane. */
import {httpService} from './services/httpService';
// If none provided, stub with XHR.
try {
  mio.dependency.get<mio.IHttpService>('IHttpService')();
} catch (error) {
  mio.dependency.set('IHttpService', httpService);
}
let library = undefined;
export function openActiveLibrary(): mio.ILibrary {
  if (library.hasValue) {
    return library.value;
  } else {
    throw new Error('No library is currently active.');
  }
}
// Provide library for testing purposes.
(async function(): Promise<void> {
  library = await mio.openRemoteLibraryAsync(undefined, undefined);
  if (library.hasValue) {
    (window as any).library = library.value;
    (window as any).mio = mio;
  }
})();

/**
 * Represents the preview image cache.
 */
export let cache: {[seriesId: number]: string} = {};

/**
 * Represents the application store.
 */
export let store: mio.IStore<mio.IApplicationState> = mio.createStore<mio.IApplicationState>({
  chapters: undefined,
  menu: {genres: {}, order: {ascending: true, type: mio.OrderType.SeriesTitle}, search: '', type: mio.MenuType.Default},
  modal: {error: undefined, type: mio.ModalType.None},
  series: {all: undefined, processed: undefined}
});

/*
 * Start the application.
 */
setTimeout(function(): void {
  FastClick.attach(document.body);
  ReactDOM.render(React.createElement(mio.ApplicationController), document.body);
}, 0);
