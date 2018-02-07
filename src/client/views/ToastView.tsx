import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import {toastStyle} from './styles/toastStyle';

@mobxReact.observer
export class ToastView extends React.Component {
  render() {
    return (
      <div style={toastStyle.container}>
        {mio.toastViewModel.items.map(item => <mui.Typography key={item.id} type="body1" style={toastStyle.typography}>
          {item.text}
        </mui.Typography>)}
      </div>
    );
  }
}
