import * as React from 'react';
import * as mio from '../';

export class SeriesController extends mio.MatchController<{providerName: string, seriesName: string}, mio.SeriesViewModel> {
  async createAsync(params: {providerName: string, seriesName: string}) {
    let vm = new mio.SeriesViewModel(params.providerName, params.seriesName);
    await vm.refreshAsync();
    return vm;
  }

  render() {
    if (this.state.vm) {
      return (
        <mio.ContainerComponent refresh={() => this.refresh()}>
          <mio.SeriesView vm={this.state.vm} />
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
