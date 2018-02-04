import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';

@mobxReact.observer
export class LayerView extends React.Component {
  render() {
    let visibleIndex = mio.layerViewModel.layers.length - 1;
    return mio.layerViewModel.layers.map((layer, index) => {
      let display = index === visibleIndex ? 'block' : 'none';
      return <div key={index} style={{display}}>{layer}</div>;
    });
  }
}
