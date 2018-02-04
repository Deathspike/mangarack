import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {listStyle} from './style/listStyle';

@mobxReact.observer
export class ListView extends React.Component<{vm: mio.ListViewModel}> {
  render() {
    return (
      <mui.Paper>
        <mui.List>
          {this.props.vm.entries.map(listEntry => (
            <mui.ListItem button key={listEntry.uniqueKey} onClick={() => listEntry.navigateTo()}>
              <mui.ListItemIcon>
                <muiIcon.Folder />
              </mui.ListItemIcon>
              <mui.ListItemText primary={listEntry.displayName} secondary={listEntry.providerName} style={listStyle.listItem} />
            </mui.ListItem>
          ))}
        </mui.List>
      </mui.Paper>
    );
  }
}
