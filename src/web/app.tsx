import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import * as rrd from 'react-router-dom';
import 'typeface-roboto';

// todo: fixed appbar
// TODO: make an entry point for web, much like cli/server?
// TODO: stepper (back button, etc)
// TODO: the series page should be tabbed, info and chapters.

abstract class MatchController<TParams extends {[key: string]: string}, TViewModel> extends React.Component<{match: {params: TParams}}, {vm?: TViewModel}> {
  constructor(props: {match: {params: TParams}}, context?: any) {
    super(props, context)
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props: {match: {params: TParams}}) {
    let params = this._processParams(props.match.params);
    this.setState({});
    this.createAsync(params).then(vm => this.setState({vm}));
  }

  refresh() {
    let params = this._processParams(this.props.match.params);
    this.setState({vm: undefined});
    this.createAsync(params).then(vm => this.setState({vm}));
  }

  private _processParams(params: TParams) {
    let result = {} as TParams;
    for (let propertyName in params) {
      let value = params[propertyName];
      if (typeof value === 'string') result[propertyName] = decodeURIComponent(value);
    }
    return result;
  }

  abstract createAsync(params: TParams): Promise<TViewModel>;
}


class IndexController extends MatchController<{}, mio.IndexViewModel> {
  async createAsync() {
    let vm = new mio.IndexViewModel();
    await vm.refreshAsync();
    return vm;
  }

  render() {
    if (this.state.vm) {
      return (
        <mio.ContainerComponent refresh={() => this.refresh()}>
          <mio.IndexView vm={this.state.vm} />
        </mio.ContainerComponent>
      );
    } else {
      return (
        <mio.ContainerComponent>
          <mio.LoadingComponent />
        </mio.ContainerComponent>
      )
    }
  }
}

class SeriesController extends MatchController<{providerName: string, seriesName: string}, mio.SeriesViewModel> {
  async createAsync(params: {providerName: string, seriesName: string}) {
    let vm = new mio.SeriesViewModel(params.providerName, params.seriesName);
    await vm.refreshAsync();
    return vm;
  }

  render() {
    if (this.state.vm) {
      return (
        <mio.ContainerComponent refresh={() => this.refresh()}>
          <mio.SeriesView vm={this.state.vm} />
        </mio.ContainerComponent>
      );
    } else {
      return (
        <mio.ContainerComponent>
          <mio.LoadingComponent />
        </mio.ContainerComponent>
      )
    }
  }
}

class ChapterController extends MatchController<{providerName: string, seriesName: string, chapterName: string}, mio.ChapterViewModel> {
  async createAsync(params: {providerName: string, seriesName: string, chapterName: string}) {
    let vm = new mio.ChapterViewModel(params.providerName, params.seriesName, params.chapterName);
    await vm.refreshAsync();
    return vm;
  }

  render() {
    if (this.state.vm) {
      return <mio.ChapterView vm={this.state.vm} />;
    } else {
      return <mio.LoadingComponent />;
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
