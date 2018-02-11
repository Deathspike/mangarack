import * as React from 'react';
import * as mio from '../';
import * as mobxReact from 'mobx-react';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {chapterControlStyle} from './styles/chapterControlStyle';

// [Improvement/HiPi] Read direction selection (and respect ltr and rtl based on comic type).
// [Improvement/HiPi] Select must use secondary color.
@mobxReact.observer
export class ChapterControlView extends React.Component<{controlVm: mio.ChapterControlViewModel, pageVm: mio.ChapterPageViewModel}> {
  render() {
    return (
      <mui.AppBar color="secondary" style={{visibility: this.props.controlVm.visible ? 'visible' : 'hidden'}}>
        <mui.Toolbar>
          <mui.IconButton color="inherit" onClick={() => this.props.controlVm.close()} style={chapterControlStyle.primaryButton}>
            <muiIcon.Close />
          </mui.IconButton>
          <mui.Select onChange={e => this._onChangeChapter(e.target.value)} native={true} value={this.props.controlVm.chapterName} style={chapterControlStyle.chapterSelect}>
            {this.props.controlVm.seriesChapters.map(seriesChapter => <option key={seriesChapter.name} value={seriesChapter.name}>{seriesChapter.shortName}</option>)}
          </mui.Select>
          <mui.Select onChange={e => this._onChangePageAsync(e.target.value)} native={true} value={this.props.pageVm.pageIndex} style={chapterControlStyle.pageSelect}>
            {this.props.pageVm.pages.map(pageData => <option key={pageData.index} value={pageData.index}>{pageData.name}</option>)}
          </mui.Select>
        </mui.Toolbar>
      </mui.AppBar>
    );
  }

  private _onChangeChapter(value: string) {
    this.props.controlVm.changeChapterAsync(value);
  }

  private async _onChangePageAsync(value: string) {
    let index = parseInt(value);
    await this.props.pageVm.changeAsync(index);
    this.props.controlVm.hide();
  }
}
