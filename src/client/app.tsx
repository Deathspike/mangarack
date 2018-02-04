import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import * as mobx from 'mobx';
import 'typeface-roboto';
mobx.useStrict(true);

// TODO: error handling
// TODO: chapter loading indicator.
// TODO: chapter listing name is way too long for what's necessary.. V01 #001
// TODO: make an entry point for client, much like cli/server?
// TODO: export {
// TODO: android back button.

ReactDOM.render(<div>
  <mui.Reboot />
  <mio.LoadingView />
  <mio.LayerView />
  <mio.ToastView />
</div>, document.getElementById('container'));

mio.areas.list.openAsync();
