import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';

@mobxReact.observer
export class LayerView extends React.Component<{vm: mio.LayerViewModel}> {
  render() {
    let visibleIndex = this.props.vm.layers.length - 1;
    return this.props.vm.layers.map((layer, index) => {
      let display = index === visibleIndex ? 'block' : 'none';
      return <div key={index} style={{display}}>{layer}</div>;
    });
  }
}
