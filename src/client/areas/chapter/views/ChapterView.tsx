import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import {chapterStyle} from './styles/chapterStyle';

@mobxReact.observer
export class ChapterView extends React.Component<{vm: mio.ChapterViewModel}> {
  private _pinchZoom?: mio.PinchZoom;

  componentWillMount() {
    this._pinchZoom = new mio.PinchZoom();
  }

  componentWillUnmount() {
    if (this._pinchZoom) {
      this._pinchZoom.detach();
      this._pinchZoom = undefined;
    }
  }

  render() {
    return (
      <div ref={divElement => this._onRef(divElement)} onMouseDown={e => this._onMouseEvent(e)} style={chapterStyle.imageContainer}>
        <img onContextMenu={e => this._onContextMenu(e)} src={this.props.vm.image} style={chapterStyle.image} />
      </div>
    );
  }

  private _onContextMenu(e: React.MouseEvent<HTMLImageElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  private _onMouseEvent(e: React.MouseEvent<HTMLDivElement>) {
    let tresholdX = innerWidth / 2;
    let tresholdY = innerHeight / 3;
    if (e.clientY < tresholdY) {
      this.props.vm.close();
    } else if (e.clientX < tresholdX) {
      this.props.vm.nextPageAsync();
    } else {
      this.props.vm.previousPageAsync();
    }
  }

  private _onRef(divElement: HTMLDivElement | null) {
    if (this._pinchZoom && divElement) {
      this._pinchZoom.attach(divElement);
      this._pinchZoom.reset();
    }
  }
}
