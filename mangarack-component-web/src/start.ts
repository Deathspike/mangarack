import * as mio from './default';


/* TODO: Move this somewhere a little more sane. */
import {httpService} from './services/httpService';
// If none provided, stub with XHR.
try {
  mio.dependency.get<mio.IHttpService>('IHttpService')();
} catch (error) {
  mio.dependency.set('IHttpService', httpService);
}
/* TODO: Move this somewhere a little more sane. */
let library = mio.option<mio.ILibrary>();
export function openActiveLibrary(): mio.ILibrary {
  if (library.hasValue) {
    return library.value;
  } else {
    throw new Error('No library is currently active.')
  }
}
// Provide library for testing purposes.
(async function() {
  library = await mio.openRemoteLibraryAsync(mio.option<string>(), mio.option<string>());
  if (library.hasValue) {
    console.log('Stand by, ready. Set up.');
    (window as any).library = library.value;
  } else {
    console.log(':-(');
  }
})();


/**
 * Represents the application store.
 */
export let store: mio.IStore<mio.IApplicationState> = mio.createStore<mio.IApplicationState>({
  menu: {genres: {}, type: mio.MenuType.Default, search: ''},
  modalType: mio.ModalType.None,
  series: mio.option<mio.ILibrarySeries[]>()
});

/*
 * Start the application.
 */
setTimeout(function(): void {
  FastClick.attach(document.body);
  ReactDOM.render(React.createElement(mio.ApplicationController), document.body);
}, 0);
