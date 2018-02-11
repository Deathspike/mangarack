import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mio from './';
import * as mobx from 'mobx';
import 'typeface-roboto';
mobx.useStrict(true);

// TODO: Chapter top-tap expand menu (show page number, page jump, next/previous chapter, read direction, close).
// [Improvement] Clean up numeric constants that should be in settings.
// [Improvement] Clean up the `export {` pattern.
// [Improvement] window.addEventListener should clean up on an application unload (to be written).

export function processError(reason: any) {
  console.error(reason);
  mio.layerViewModel.reset();
  mio.toastViewModel.show(mio.language.APP_ERROR);
}

export function processStart() {
  ReactDOM.render(<mio.AppView />, document.getElementById('container'));
  mio.layerViewModel.openAsync(mio.areas.list.initializeAsync());
}
