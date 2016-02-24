import * as mio from './default';

// If none provided, stub with XHR.
try {
  mio.dependency.get<mio.IHttpService>('IHttpService')();
} catch (error) {
  mio.dependency.set('IHttpService', mio.httpService);
}

// Provide library for testing purposes.
(async function() {
  let library = await mio.openRemoteLibraryAsync(mio.option<string>(), mio.option<string>());
  if (library.hasValue) {
    console.log('Stand by, ready. Set up.');
    (window as any).library = library.value;
  } else {
    console.log(':-(');
  }
})();
