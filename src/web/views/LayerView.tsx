import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';

@mobxReact.observer
export class LayerView extends React.Component {
  render() {
    return (
      <div>
        {mio.layerViewModel.loading.get() && <mio.LoadingComponent />}
        {mio.layerViewModel.layers.map((layer, index) => {
          let display = index === mio.layerViewModel.layers.length - 1 ? 'block' : 'none';
          return <div key={index} style={{display}}>{layer}</div>;
        })};
      </div>
    );
  }
}
