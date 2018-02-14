import * as React from 'react';
import * as mio from '../';
import * as mobxReact from 'mobx-react';
import {chapterStyle} from './styles/chapterStyle';

@mobxReact.observer
export class ChapterPageView extends React.Component<{controlVm: mio.ChapterControlViewModel, pageVm: mio.ChapterPageViewModel}> {
  private _touchManager?: mio.TouchManager;

  componentWillMount() {
    this._onKeyDownEvent = this._onKeyDownEvent.bind(this);
    this._onTapEvent = this._onTapEvent.bind(this);
    this._touchManager = new mio.TouchManager(this._onTapEvent);
    document.addEventListener('keydown', this._onKeyDownEvent);
  }

  componentWillUnmount() {
    if (this._touchManager) {
      this._touchManager.detach();
      this._touchManager = undefined;
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

  private _blurAndHide() {
    if (document.activeElement) (document.activeElement as HTMLElement).blur();
    this.props.controlVm.hide();
  }

  private _onContextMenu(e: React.MouseEvent<HTMLImageElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  private _onKeyDownEvent(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 37:
        this._blurAndHide();
        this.props.pageVm.nextAsync();
        break;
      case 39:
        this._blurAndHide();
        this.props.pageVm.previousAsync();
        break;
    }
  }

  private _onRef(divElement: HTMLDivElement | null) {
    if (this._touchManager && divElement) {
      this._touchManager.attachWithPinchZoom(divElement);
      this._touchManager.reset();
    }
  }

  private _onTapEvent(x: number, y: number) {
    let tresholdX = innerWidth / 2;
    let tresholdY = innerHeight / 3;
    if (y < tresholdY) {
      if (this.props.controlVm.visible) {
        this._blurAndHide();
      } else {
        this.props.controlVm.show();
      }
    } else if (x < tresholdX) {
      this._blurAndHide();
      this.props.pageVm.nextAsync();
    } else {
      this._blurAndHide();
      this.props.pageVm.previousAsync();
    }
  }
}
