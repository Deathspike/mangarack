import * as React from 'react';
import * as mio from '../';

export class ChapterController extends mio.MatchController<{providerName: string, seriesName: string, chapterName: string}, mio.ChapterViewModel> {
  async createAsync(params: {providerName: string, seriesName: string, chapterName: string}) {
    let vm = new mio.ChapterViewModel(params.providerName, params.seriesName, params.chapterName);
    await vm.refreshAsync();
    return vm;
  }

  render() {
    if (this.state.vm) {
      return <mio.ChapterView vm={this.state.vm} />;
    } else {
      return <mio.LoadingComponent />;
    }
  }
}
