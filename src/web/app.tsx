import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import * as rrd from 'react-router-dom';
import 'typeface-roboto';

// TODO: !!! SERIESITEM IS THE WORST NAME EVER. MAKE IT CHAPTER AGAIN (so xItem can be sub of type..)

// todo: fixed appbar
// TODO: make an entry point for web, much like cli/server?
// TODO: Needs wide appbar.
// TODO: Needs a refresh button for obvious reasons.
// TODO: stepper (back button, etc)
// TODO: the series page should be tabbed, info and chapters.

class ProviderController extends React.Component {
  render() {
    return <mio.ProviderView vm={new mio.ProviderViewModel()} />
  }
}


class SeriesController extends React.Component<{match: {params: {providerName: string, seriesName: string}}}> {
  render() {
    let params = this.props.match.params;
    return <mio.SeriesView vm={new mio.SeriesViewModel(params.providerName, params.seriesName)} />;
  }
}

function Router() {
  return (
    <rrd.HashRouter>
      <rrd.Switch>
        <rrd.Route path="/:providerName/:seriesName" component={SeriesController} />
        <rrd.Route path="/" component={ProviderController} />
      </rrd.Switch>
    </rrd.HashRouter>
  );
}

function App() {
  return (
    <div>
      <mui.Reboot />
      <mui.AppBar color="primary" position="static">
        <mui.Toolbar>
          <mui.Typography color="inherit" type="title">
            MangaRack
          </mui.Typography>
        </mui.Toolbar>
      </mui.AppBar>
      <div style={{margin: '0 auto', maxWidth: '640px'}}>
        <Router />
      </div>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
