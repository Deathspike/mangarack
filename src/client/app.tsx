import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import * as mobx from 'mobx';
import 'typeface-roboto';
mobx.useStrict(true);

// TODO: Chapter top-tap expand menu (show page number, page jump, next/previous chapter, read direction, close).
// TODO: error handling
// [Improvement] Clean up numeric constants that should be in settings.
// [Improvement] Clean up the `export {` pattern.
// [Improvement] window.addEventListener should clean up on an application unload (to be written).

function App() {
  return (
    <mui.MuiThemeProvider theme={mio.theme}>
      <mui.Reboot />
      <mio.LayerView />
      <mio.ToastView />
      <mio.LoadingView />
    </mui.MuiThemeProvider>
  );
}

(function() {
  ReactDOM.render(<App />, document.getElementById('container'));
  mio.layerViewModel.openAsync(mio.areas.list.initializeAsync());
})();
