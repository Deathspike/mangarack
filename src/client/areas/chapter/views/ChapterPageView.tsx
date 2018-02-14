import * as React from 'react';
import * as mio from '../';
import * as mobxReact from 'mobx-react';
import {chapterStyle} from './styles/chapterStyle';

@mobxReact.observer
export class ChapterPageView extends React.Component<{controlVm: mio.ChapterControlViewModel, pageVm: mio.ChapterPageViewModel}> {
  private _pinchZoom?: mio.PinchZoom;

  componentWillMount() {
    this._onKeyDownEvent = this._onKeyDownEvent.bind(this);
    this._onTapEvent = this._onTapEvent.bind(this);
    this._pinchZoom = new mio.PinchZoom(this._onTapEvent);
    document.addEventListener('keydown', this._onKeyDownEvent);
  }

  componentWillUnmount() {
    if (this._pinchZoom) {
      this._pinchZoom.detach();
      this._pinchZoom = undefined;
      document.removeEventListener('keydown', this._onKeyDownEvent);
    }
  }

  render() {
    return (
      <div ref={divElement => this._onRef(divElement)} style={chapterStyle.imageContainer}>
        <img onContextMenu={e => this._onContextMenu(e)} src={this.props.pageVm.image} style={chapterStyle.image} />
      </div>
    );
  }

  private _onContextMenu(e: React.MouseEvent<HTMLImageElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  private _onKeyDownEvent(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 37:
        this.props.controlVm.hide();
        this.props.pageVm.nextAsync();
        break;
      case 39:
        this.props.controlVm.hide();
        this.props.pageVm.previousAsync();
        break;
    }
  }

  private _onRef(divElement: HTMLDivElement | null) {
    if (this._pinchZoom && divElement) {
      this._pinchZoom.attach(divElement);
      this._pinchZoom.reset();
    }
  }

  private _onTapEvent(x: number, y: number) {
    let tresholdX = innerWidth / 2;
    let tresholdY = innerHeight / 3;
    if (y < tresholdY) {
      this.props.controlVm.toggleVisible();
    } else if (x < tresholdX) {
      this.props.controlVm.hide();
      this.props.pageVm.nextAsync();
    } else {
      this.props.controlVm.hide();
      this.props.pageVm.previousAsync();
    }
  }
}
