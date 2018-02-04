import * as React from 'react';
import * as mio from '../';

export class ListController extends mio.MatchController<{}, mio.ListViewModel> {
  async createAsync() {
    let vm = new mio.ListViewModel();
    await vm.refreshAsync();
    return vm;
  }

  render() {
    if (this.state.vm) {
      return (
        <mio.ContainerComponent refresh={() => this.refresh()}>
          <mio.ListView vm={this.state.vm} />
        </mio.ContainerComponent>
      );
    } else {
      return (
        <mio.ContainerComponent>
          <mio.LoadingComponent />
        </mio.ContainerComponent>
      )
    }
  }
}
