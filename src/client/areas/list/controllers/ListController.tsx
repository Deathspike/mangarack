import * as React from 'react';
import * as mio from '../';

export class ListController extends React.Component<{vm: mio.ListViewModel}> {
  render() {
    return (
      <mio.ContainerComponent enableBack={false} title={document.title} refreshAsync={() => this.props.vm.refreshAsync()}>
        <mio.ListView vm={this.props.vm} />
      </mio.ContainerComponent>
    );
  }
}
