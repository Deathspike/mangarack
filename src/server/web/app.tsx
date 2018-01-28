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
    this.data = response;
  }

  @mobx.observable
  data: mio.ILibraryProvider | undefined;
}

@mobxReact.observer
class ProviderView extends React.Component<{vm: ProviderViewModel}> {
  componentDidMount() {
    this.props.vm.refreshAsync();
  }

  render() {
    if (this.props.vm.data) {
      return (
        <Material.List>
          {this.props.vm.data.map(item => (
            <Material.ListItem button key={item.providerName + item.seriesName}>
              <Material.Typography color="inherit" type="body1">
                {item.displayName}
              </Material.Typography>
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
    <div style={{margin: '0 auto', maxWidth: '800px'}}>
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
