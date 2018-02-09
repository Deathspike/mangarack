import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import * as mobx from 'mobx';
import 'typeface-roboto';
mobx.useStrict(true);

// TODO: Check if there are numeric constants that need to be in settings.
// TODO: Chapter top-tap expand menu (show page number, page jump, next/previous chapter, read direction, close).
// TODO: disable text select?
// TODO: error handling
// TODO: make an entry point for client, much like cli/server?
// TODO: export {

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
