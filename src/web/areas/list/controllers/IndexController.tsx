import * as React from 'react';
import * as mio from '../';

export class IndexController extends mio.MatchController<{}, mio.IndexViewModel> {
  async createAsync() {
    let vm = new mio.IndexViewModel();
    await vm.refreshAsync();
    return vm;
  }

  render() {
    if (this.state.vm) {
      return (
        <mio.ContainerComponent refresh={() => this.refresh()}>
          <mio.IndexView vm={this.state.vm} />
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
