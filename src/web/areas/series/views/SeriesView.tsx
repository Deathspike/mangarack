import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';

@mobxReact.observer
export class SeriesView extends React.Component<{vm: mio.SeriesViewModel}> {
  render() {
    return (
      <mui.Paper>
        <mui.List>
          {this.props.vm.chapters.map(seriesChapterViewModel => <mio.SeriesChapterView key={seriesChapterViewModel.uniqueKey} vm={seriesChapterViewModel} />)}
        </mui.List>
      </mui.Paper>
    );
  }
}
