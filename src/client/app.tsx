import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import * as mobx from 'mobx';
import 'typeface-roboto';
mobx.useStrict(true);

// TODO: Cli should tell when an URL is not recognized.
// TODO: Chapter top-tap expand menu (show page number, page jump, next/previous chapter, read direction, close).
// TODO: disable text select?
// TODO: error handling
// TODO: make an entry point for client, much like cli/server?
// TODO: export {

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
  mio.layerViewModel.openAsync(mio.areas.list.initializeAsync());
})();
