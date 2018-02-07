import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {listEntryStyle} from './styles/listEntryStyle';

@mobxReact.observer
export class ListEntryView extends React.Component<{vm: mio.ListEntryViewModel}> {
  render() {
    return (
      <mui.ListItem button onClick={() => this.props.vm.openAsync()}>
        <mui.ListItemIcon>
          <muiIcon.Folder />
        </mui.ListItemIcon>
        <mui.ListItemText primary={this.props.vm.seriesTitle} secondary={this.props.vm.providerName} style={listEntryStyle.listItemText} />
      </mui.ListItem>
    );
  }
}
