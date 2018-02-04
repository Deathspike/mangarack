import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';

@mobxReact.observer
export class LayerView extends React.Component<{vm: mio.LayerViewModel}> {
  render() {
    return <div>{this.props.vm.layers}</div>;
  }
}
