import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import {chapterStyle} from './styles/chapterStyle';

@mobxReact.observer
export class ChapterView extends React.Component<{vm: mio.ChapterViewModel}> {
  render() {
    return (
      <div ref={divElement => this._onLoad(divElement)} onClick={e => this._onClick(e)} style={chapterStyle.imageContainer}>
        <img src={this.props.vm.image} style={chapterStyle.image} />
      </div>
    );
  }

  private _onClick(e: React.MouseEvent<HTMLDivElement>) {
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

  private _onLoad(divElement: HTMLDivElement | null) {
    if (divElement) {
      mio.pinchZoom(divElement);
    }
  }
}
