import * as React from 'react';
import * as mui from 'material-ui';
import {loadingStyle} from './styles/loadingStyle';

export class LoadingComponent extends React.Component {
  render() {
    return <mui.CircularProgress style={loadingStyle.icon} />;
  }
}
