import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';

@mobxReact.observer
export class ProviderView extends React.Component<{vm: mio.ProviderViewModel}> {
  componentWillMount() {
    this.props.vm.refreshAsync();
  }

  render() {
    if (this.props.vm.sortedData) {
      return (
        <mui.List>
          {this.props.vm.sortedData.map(item => (
            <mui.ListItem button key={item.providerName + item.seriesName}>
              <mui.ListItemIcon>
                <muiIcon.Folder />
              </mui.ListItemIcon>
              <mui.ListItemText primary={item.displayName} secondary={item.providerName} />
            </mui.ListItem>
          ))}
        </mui.List>
      )
    } else {
      // TODO: Center.
      return <mui.CircularProgress />;
    }
  }
}
