import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import * as rrd from 'react-router-dom';

// TODO: rrd.Link is <a>, weird styles on ListItem, better way?
@mobxReact.observer
export class ProviderView extends React.Component<{vm: mio.ProviderViewModel}> {
  componentWillMount() {
    this.props.vm.fetchAsync();
  }

  render() {
    let vm = this.props.vm;
    if (vm.currentData) {
      return (
        <mui.Paper>
          <mui.List>
            {vm.currentData.map(item => (
              <rrd.Link to={`/${encodeURIComponent(item.providerName)}/${encodeURIComponent(item.seriesName)}`}>
                <mui.ListItem button key={`${item.providerName}/${item.seriesName}`}>
                  <mui.ListItemIcon>
                    <muiIcon.Folder />
                  </mui.ListItemIcon>
                  <mui.ListItemText primary={item.displayName} secondary={item.providerName} />
                </mui.ListItem>
              </rrd.Link>
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
