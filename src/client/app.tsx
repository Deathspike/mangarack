import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mio from './';
import * as mobx from 'mobx';
import 'typeface-roboto';
mobx.useStrict(true);

/*
Previous chapter start at the last page.. because THAT makes sense.
The ability to select reading direction (it's always right-to-left for now).
The automatic detection of non-manga (thus using right-to-left reading).
The ability to go full screen anywhere but the homescreen
*/
// [Improvement] Clean up numeric constants that should be in settings.
// [Improvement] Clean up the `export {` pattern.
// [Improvement] window.addEventListener should clean up on an application unload (to be written).

export function processError(error: any) {
  console.error((error && error.stack) || error);
  mio.layerViewModel.reset();
  mio.toastViewModel.show(mio.language.APP_ERROR);
}

export function processStart() {
  ReactDOM.render(<mio.AppView />, document.getElementById('container'));
  mio.layerViewModel.openAsync(mio.areas.list.initializeAsync());
}
