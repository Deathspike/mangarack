import * as React from 'react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {containerStyle} from './styles/containerStyle';

// [iOS] Hide full-screen button if no full-screen API is available.
// [iOS] Enable scroll momentum. Terrible performance right now (due to Position style?).
// [iOS] Disable bounce out-of-bounds.
export class ContainerComponent extends React.Component<{enableBack: boolean, title: string, refreshAsync: () => Promise<void>}> {
  render() {
    return (
      <div>
        <mui.AppBar>
          <mui.Toolbar>
            <mui.IconButton color="inherit" onClick={() => this._onButtonClick()} style={containerStyle.primaryButton}>
              {this.props.enableBack ? <muiIcon.ArrowBack /> : <muiIcon.Fullscreen />}
            </mui.IconButton>
            <mui.Typography color="inherit" variant="title" style={containerStyle.typography}>
              {this.props.title}
            </mui.Typography>
            <mui.IconButton color="inherit" onClick={() => this._onRefreshClick()} style={containerStyle.secondaryButton}>
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
      let unsafeElement = document.body as any;
      let request = unsafeElement.requestFullScreen || unsafeElement.webkitRequestFullScreen;
      if (request) request.call(unsafeElement);
    }
  }

  private _onRefreshClick() {
    let refreshAsync = this.props.refreshAsync;
    if (refreshAsync) mio.loadingViewModel.loadAsync(refreshAsync);
  }
}
