import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import * as mobx from 'mobx';
import 'typeface-roboto';
mobx.useStrict(true);

// TODO: clean up entire chapter area.. check paper notes!
// TODO: error handling
// TODO: chapter loading indicator.
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
