import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';

@mobxReact.observer
export class ListView extends React.Component<{vm: mio.ListViewModel}> {
  render() {
    return (
      <mui.Paper>
        <mui.List>
          {this.props.vm.entries.map(listEntry => <mio.ListEntryView key={listEntry.key} vm={listEntry} />)}
        </mui.List>
      </mui.Paper>
    );
  }
}
