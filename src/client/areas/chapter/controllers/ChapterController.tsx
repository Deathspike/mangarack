import * as React from 'react';
import * as mio from '../';

export class ChapterController extends React.Component<{controlVm: mio.ChapterControlViewModel, pageVm: mio.ChapterPageViewModel}> {
  render() {
    return (
      <div>
        <mio.ChapterControlView controlVm={this.props.controlVm} pageVm={this.props.pageVm} />
        <mio.ChapterPageView controlVm={this.props.controlVm} pageVm={this.props.pageVm} />
      </div>
    );
  }
}
