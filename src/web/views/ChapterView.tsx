import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';

@mobxReact.observer
export class ChapterView extends React.Component<{vm: mio.ChapterViewModel}> {
  componentWillMount() {
    this.props.vm.fetchAsync();
  }

  render() {
    return <img src={this.props.vm.imageUrl} />;
  }
}
