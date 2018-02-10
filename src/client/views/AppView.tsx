import * as React from 'react';
import * as mui from 'material-ui';
import * as mio from '../';

export class AppView extends React.Component {
  render() {
    return (
      <mui.MuiThemeProvider theme={mio.theme}>
        <mui.Reboot />
        <mio.LayerView />
        <mio.ToastView />
        <mio.LoadingView />
      </mui.MuiThemeProvider>
    );
  }
}
