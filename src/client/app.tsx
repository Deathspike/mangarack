import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import * as mobx from 'mobx';
import 'typeface-roboto';
mobx.useStrict(true);

// TODO: remove pinch zoom / reorganize chapter area.. mainly the excess folders.
// TODO: error handling
// TODO: make an entry point for client, much like cli/server?
// TODO: export {
// TODO: backbutton listener detach?

function App() {
  return (
    <div>
      <mui.Reboot />
      <mio.LayerView />
      <mio.ToastView />
      <mio.LoadingView />
    </div>
  );
}

(function() {
  ReactDOM.render(<App />, document.getElementById('container'));
  document.addEventListener('backbutton', mio.layerViewModel.close);
  mio.areas.list.openAsync();
})();
