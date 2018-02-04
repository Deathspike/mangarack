import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';

// TODO: Switch icon on downloaded/exists.
@mobxReact.observer
export class SeriesChapterView extends React.Component<{vm: mio.SeriesChapterViewModel}> {
  render() {
    return (
      <mui.ListItem button onClick={() => this.props.vm.tryNavigateTo()}>
        <mui.ListItemIcon>
          {this.props.vm.exists ? <muiIcon.InsertDriveFile /> : <muiIcon.Error />}
        </mui.ListItemIcon>
        <mui.ListItemText primary={this.props.vm.name} />
      </mui.ListItem>
    );
  }
}
