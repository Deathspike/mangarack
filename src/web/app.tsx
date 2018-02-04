import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import 'typeface-roboto';

// TODO: web->client
// TODO: chapter loading indicator.
// TODO: chapter listing name is way too long for what's necessary.. V01 #001
// TODO: make an entry point for web, much like cli/server?
// TODO: the series page should be tabbed, info and chapters.
// TODO: export {

ReactDOM.render(<div>
  <mui.Reboot />
  <mio.LayerView />
</div>, document.getElementById('container'));

mio.areas.list.createAsync();
