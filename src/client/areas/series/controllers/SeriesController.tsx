import * as React from 'react';
import * as mio from '../';

export class SeriesController extends React.Component<{vm: mio.SeriesViewModel}> {
  render() {
    return (
      <mio.ContainerComponent enableBack={true} title={this.props.vm.title} refresh={() => this.props.vm.refreshAsync()}>
        <mio.SeriesView vm={this.props.vm} />
      </mio.ContainerComponent>
    );
  }
}
