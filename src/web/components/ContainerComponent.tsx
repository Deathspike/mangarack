import * as React from 'react';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {containerStyle} from './styles/containerStyle';

export class ContainerComponent extends React.Component<{refresh?: Function}> {
  render() {
    return (
      <div>
        <mui.AppBar color="primary" position="static">
          <mui.Toolbar>
            <mui.IconButton color="inherit" onClick={() => this._onMaximizeClick()}>
              <muiIcon.Fullscreen />
            </mui.IconButton>
            <mui.Typography color="inherit" type="title" style={containerStyle.header}>
              MangaRack
            </mui.Typography>
            {this.props.refresh && <mui.IconButton color="inherit" onClick={() => this._onRefreshClick()}>
              <muiIcon.Refresh />
            </mui.IconButton>}
          </mui.Toolbar>
        </mui.AppBar>
        <div style={containerStyle.container}>
          {this.props.children}
        </div>
      </div>
    );
  }

  private _onMaximizeClick() {
    let element = document.body as any;
    let request = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (request) request.call(element);
  }

  private _onRefreshClick() {
    let refresh = this.props.refresh;
    if (refresh) refresh();
  }
}
