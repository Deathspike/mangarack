import * as React from 'react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {containerStyle} from './styles/containerStyle';

export class ContainerComponent extends React.Component<{enableBack: boolean, title: string, refreshAsync: () => Promise<void>}> {
  render() {
    return (
      <div>
        <mui.AppBar color="primary" position="static">
          <mui.Toolbar>
            <mui.IconButton color="inherit" onClick={() => this._onButtonClick()} style={containerStyle.menuIcon}>
              {this.props.enableBack ? <muiIcon.ArrowBack /> : <muiIcon.Fullscreen />}
            </mui.IconButton>
            <mui.Typography color="inherit" type="title" style={containerStyle.header}>
              {this.props.title}
            </mui.Typography>
            <mui.IconButton color="inherit" onClick={() => this._onRefreshClick()}>
              <muiIcon.Refresh />
            </mui.IconButton>
          </mui.Toolbar>
        </mui.AppBar>
        <div style={containerStyle.container}>
          {this.props.children}
        </div>
      </div>
    );
  }

  private _onButtonClick() {
    if (this.props.enableBack) {
      mio.layerViewModel.close();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
      document.webkitCancelFullScreen();
    } else {
      let element = document.body as any;
      let request = element.requestFullScreen || element.webkitRequestFullScreen;
      if (request) request.call(element);
    }
  }

  private _onRefreshClick() {
    let refreshAsync = this.props.refreshAsync;
    if (refreshAsync) mio.loadingViewModel.loadAsync(refreshAsync);
  }
}
