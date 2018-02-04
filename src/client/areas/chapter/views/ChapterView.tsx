import * as Hammer from 'hammerjs';
import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import {chapterStyle} from './styles/chapterStyle';

@mobxReact.observer
export class ChapterView extends React.Component<{vm: mio.ChapterViewModel}> {
  render() {
    return (
      <div ref={divElement => this._onLoad(divElement)} onClick={e => this._onClick(e)} style={chapterStyle.imageContainer}>
        <img src={this.props.vm.img} style={chapterStyle.image} />
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
    if (divElement) makePinch(divElement);
  }
}

// TODO: Boundaries. Clean up.
function makePinch(el: HTMLElement) {
  let mc = new Hammer.Manager(el);
  let pinch = new Hammer.Pinch();
  let pan = new Hammer.Pan();

  pinch.recognizeWith(pan);
  mc.add([pinch, pan]);

  let adjustScale = 1;
  let adjustDeltaX = 0;
  let adjustDeltaY = 0;

  let currentScale = 0;
  let currentDeltaX = 0;
  let currentDeltaY = 0;
  let panDelay = 0;

  mc.on('pan pinch', ev => {
    if (ev.type === 'pan' && panDelay >= Date.now()) return;
    currentScale = Math.max(1, adjustScale * ev.scale);
    currentDeltaX = adjustDeltaX + (ev.deltaX / currentScale);
    currentDeltaY = adjustDeltaY + (ev.deltaY / currentScale);
    el.style.transform = `scale(${currentScale}) translate(${currentDeltaX}px,${currentDeltaY}px)`;
  });

  mc.on('panend pinchend', ev => {
      adjustScale = currentScale;
      adjustDeltaX = currentDeltaX;
      adjustDeltaY = currentDeltaY;
      if (ev.type === 'pinchend') panDelay = Date.now() + 200;
  });
}
