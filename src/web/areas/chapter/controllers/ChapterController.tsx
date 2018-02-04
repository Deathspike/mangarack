import * as React from 'react';
import * as mio from '../';

export class ChapterController extends React.Component<{vm: mio.ChapterViewModel}> {
  render() {
    return <mio.ChapterView vm={this.props.vm} />;
  }
}
