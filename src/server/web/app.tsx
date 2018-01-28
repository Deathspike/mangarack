import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Material from 'material-ui';
import * as MaterialIcon from 'material-ui-icons';
import 'typeface-roboto';

// TODO: Continue here.
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as mio from '../';

class ProviderViewModel {
  @mobx.action
  async refreshAsync() {
    let request = await fetch('/api/library');
    let response = await request.json();
    this.rawData = response;
  }

  @mobx.computed
  get sortedData() {
    if (this.rawData) {
      return this.rawData
        .map(({displayName, seriesName, providerName}) => ({displayName, seriesName, providerName}))
        .sort((a, b) => a.displayName < b.displayName ? -1 : 1);
    } else {
      return undefined;
    }
  }

  @mobx.observable
  rawData: mio.ILibraryProvider | undefined;
}

// TODO: Needs wide appbar.
// TODO: Needs a refresh button for obvious reasons.

@mobxReact.observer
class ProviderView extends React.Component<{vm: ProviderViewModel}> {
  componentWillMount() {
    this.props.vm.refreshAsync();
  }

  render() {
    if (this.props.vm.sortedData) {
      return (
        <Material.List>
          {this.props.vm.sortedData.map(item => (
            <Material.ListItem button key={item.providerName + item.seriesName}>
              <Material.ListItemIcon>
                <MaterialIcon.Folder />
              </Material.ListItemIcon>
              <Material.ListItemText primary={item.displayName} secondary={item.providerName} />
            </Material.ListItem>
          ))}
        </Material.List>
      )
    } else {
      return <Material.CircularProgress />;
    }
  }
}

function App() {
  return (
    <div style={{margin: '0 auto', maxWidth: '640px'}}>
      <Material.Reboot />
      <Material.Grid>
        <Material.AppBar color="primary" position="static">
          <Material.Toolbar>
            <Material.Typography color="inherit" type="title">
              MangaRack
            </Material.Typography>
          </Material.Toolbar>
        </Material.AppBar>
        <Material.Grid item>
          <ProviderView vm={new ProviderViewModel()} />
        </Material.Grid>
      </Material.Grid>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
