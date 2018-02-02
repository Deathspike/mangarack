import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';

@mobxReact.observer
export class ChapterView extends React.Component<{vm: mio.ChapterViewModel}> {
  componentWillMount() {
    this.props.vm.fetchAsync();
  }

  // TODO: Inline styles like this are pretty bad, eh.
  render() {
    return (
      <div onClick={e => this._onClick(e)} style={{bottom: 0, left: 0, right: 0, position: 'absolute', top: 0}}>
        <img src={this.props.vm.imageUrl} style={{
          display: 'block',
          height: '100%',
          margin: '0 auto'
        }} />
      </div>
    );
  }

  private _onClick(e: React.MouseEvent<HTMLDivElement>) {
    let tresholdX = window.innerWidth / 2;
    let tresholdY = window.innerHeight / 3;
    if (e.clientY < tresholdY) {
      this.props.vm.close();
    } else if (e.clientX < tresholdX) {
      this.props.vm.nextPage();
    } else {
      this.props.vm.previousPage();
    }
  }
}
