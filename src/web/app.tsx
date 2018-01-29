import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import 'typeface-roboto';

// todo: fixed appbar
// TODO: make an entry point for web, much like cli/server?
// TODO: Needs wide appbar.
// TODO: Needs a refresh button for obvious reasons.
// TODO: stepper (back button, etc)
// TODO: the series page should be tabbed, info and chapters.

function App() {
  return (
    <div>
      <mui.Reboot />
      <mui.AppBar color="primary" position="static">
        <mui.Toolbar>
          <mui.Typography color="inherit" type="title">
            MangaRack
          </mui.Typography>
        </mui.Toolbar>
      </mui.AppBar>
      <div style={{margin: '0 auto', maxWidth: '640px'}}>
        <mio.ProviderView vm={new mio.ProviderViewModel()} />
      </div>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
