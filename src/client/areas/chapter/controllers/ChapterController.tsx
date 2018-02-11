import * as React from 'react';
import * as mio from '../';

export class ChapterController extends React.Component<{chapterControlVm: mio.ChapterControlViewModel, chapterVm: mio.ChapterViewModel}> {
  render() {
    return (
      <div>
        <mio.ChapterControlView chapterControlVm={this.props.chapterControlVm} chapterVm={this.props.chapterVm} />
        <mio.ChapterView chapterControlVm={this.props.chapterControlVm} chapterVm={this.props.chapterVm} />
      </div>
    );
  }
}
