import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import shared = mio.shared;

@mobxReact.observer
export class SeriesView extends React.Component<{vm: mio.SeriesViewModel}> {
  componentWillMount() {
    this.props.vm.fetchAsync();
  }

  // TODO: handle .exists with icon (and button should give a warning modal)
  render() {
    let vm = this.props.vm;
    if (vm.currentData) {
      return (
        <mui.Paper>
          <mui.List>
            {vm.currentData.items.map(item => (
              <mui.ListItem button key={`${vm.providerName}/${vm.seriesName}/${shared.nameOf(vm.currentData!, item)}`}>
                <mui.ListItemIcon>
                  <muiIcon.InsertDriveFile />
                </mui.ListItemIcon>
                <mui.ListItemText primary={shared.nameOf(vm.currentData!, item)} />
              </mui.ListItem>
            ))}
          </mui.List>
        </mui.Paper>
      )
    } else {
      // TODO: Center.
      return (
        <mui.Paper>
          <mui.CircularProgress />
        </mui.Paper>
      );
    }
  }
}
