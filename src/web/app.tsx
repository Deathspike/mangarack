import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import * as mio from './';
import * as rrd from 'react-router-dom';
import 'typeface-roboto';

// todo: fixed appbar
// TODO: make an entry point for web, much like cli/server?
// TODO: Needs wide appbar.
// TODO: Needs a refresh button for obvious reasons.
// TODO: stepper (back button, etc)
// TODO: the series page should be tabbed, info and chapters.

class AppBar extends React.Component {
  render() {
    return (
      <mui.AppBar color="primary" position="static">
        <mui.Toolbar>
          <mui.IconButton color="inherit" onClick={() => this._onClick()}>
            <muiIcon.Fullscreen />
          </mui.IconButton>
          <mui.Typography color="inherit" type="title">
            MangaRack
          </mui.Typography>
        </mui.Toolbar>
      </mui.AppBar>
    );
  }

  private _onClick() {
    let element = document.body as any;
    let request = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (request) request.call(element);
  }
}

class AppContainer extends React.Component {
  render() {
    return (
      <div style={{margin: '0 auto', maxWidth: '640px'}}>
        {this.props.children}
      </div>
    );
  }
}

abstract class BaseController<TParams, TViewModel> extends React.Component<{match: {params: TParams}}, {vm?: TViewModel}> {
  constructor(props: {match: {params: TParams}}, context?: any) {
    super(props, context)
    this.state = {};
  }

  componentWillMount() {
    (async () => {
      let vm = await this.initAsync();
      this.setState({vm});
    })();
  }

  abstract initAsync(): Promise<TViewModel>;
}


class LoadingComponent extends React.Component {
  render() {
    return (
      <mui.CircularProgress style={{
        left: '50%',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }} />
    );
  }
}

class IndexController extends BaseController<{}, mio.IndexViewModel> {
  async initAsync() {
    let vm = new mio.IndexViewModel();
    await vm.refreshAsync();
    return vm;
  }

  render() {
    return (
      <div>
        <AppBar />
        <AppContainer>
          {this.state.vm ? <mio.IndexView vm={this.state.vm} /> : <LoadingComponent />}
        </AppContainer>
      </div>
    );
  }
}

class SeriesController extends BaseController<{providerName: string, seriesName: string}, mio.SeriesViewModel> {
  async initAsync() {
    let providerName = decodeURIComponent(this.props.match.params.providerName);
    let seriesName = decodeURIComponent(this.props.match.params.seriesName);
    let vm = new mio.SeriesViewModel(providerName, seriesName);
    await vm.refreshAsync();
    return vm;
  }

  render() {
    return (
      <div>
        <AppBar />
        <AppContainer>
          {this.state.vm ? <mio.SeriesView vm={this.state.vm} /> : <LoadingComponent />}
        </AppContainer>
      </div>
    );
  }
}

class ChapterController extends BaseController<{providerName: string, seriesName: string, chapterName: string}, mio.ChapterViewModel> {
  async initAsync() {
    let providerName = decodeURIComponent(this.props.match.params.providerName);
    let seriesName = decodeURIComponent(this.props.match.params.seriesName);
    let chapterName = decodeURIComponent(this.props.match.params.chapterName);
    let vm = new mio.ChapterViewModel(providerName, seriesName, chapterName);
    await vm.refreshAsync();
    return vm;
  }

  render() {
    if (this.state.vm) {
      return <mio.ChapterView vm={this.state.vm} />;
    } else {
      return <LoadingComponent />;
    }
  }
}

function App() {
  return (
    <div>
      <mui.Reboot />
      <rrd.HashRouter>
        <rrd.Switch>
          <rrd.Route path="/:providerName/:seriesName/:chapterName" component={ChapterController} />
          <rrd.Route path="/:providerName/:seriesName" component={SeriesController} />
          <rrd.Route path="/" component={IndexController} />
        </rrd.Switch>
      </rrd.HashRouter>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
