import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';

@mobxReact.observer
export class ChapterView extends React.Component<{vm: mio.ChapterViewModel}> {
  render() {
    return (
      <div onClick={e => this._onClick(e)} style={mio.chapterStyle.imageContainer}>
        <img src={this.props.vm.img} style={mio.chapterStyle.image} />
      </div>
    );
  }

  private _onClick(e: React.MouseEvent<HTMLDivElement>) {
    let tresholdX = window.innerWidth / 2;
    let tresholdY = window.innerHeight / 3;
    if (e.clientY < tresholdY) {
      this.props.vm.close();
    } else if (e.clientX < tresholdX) {
      this.props.vm.nextPageAsync();
    } else {
      this.props.vm.previousPageAsync();
    }
  }
}
