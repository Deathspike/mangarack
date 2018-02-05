import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import {loadingStyle} from './styles/loadingStyle';

@mobxReact.observer
export class LoadingView extends React.Component {
  render() {
    return (
      mio.loadingViewModel.isLoading && <div style={loadingStyle.container}>
        <mui.CircularProgress style={loadingStyle.icon} />
      </div>
    );
  }
}
