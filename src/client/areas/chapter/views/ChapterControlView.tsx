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
    return this.props.controlVm.visible && (
      <mui.AppBar color="secondary">
        <mui.Toolbar>
          <mui.IconButton color="inherit" onClick={() => this.props.controlVm.close()} style={chapterControlStyle.primaryButton}>
            <muiIcon.Close />
          </mui.IconButton>
          <mui.Select onChange={e => this._onChangeChapter(e.target.value)} value={this.props.controlVm.chapterName} style={chapterControlStyle.chapterSelect}>
            {this.props.controlVm.seriesChapters.map(seriesChapter => <mui.MenuItem key={seriesChapter.name} value={seriesChapter.name}>{seriesChapter.shortName}</mui.MenuItem>)}
          </mui.Select>
          <mui.Select onChange={e => this._onChangePage(e.target.value)} value={this.props.pageVm.pageIndex} style={chapterControlStyle.pageSelect}>
            {this.props.pageVm.pages.map(pageData => <mui.MenuItem key={pageData.index} value={pageData.index}>{pageData.name}</mui.MenuItem>)}
          </mui.Select>
        </mui.Toolbar>
      </mui.AppBar>
    );
  }

  private _onChangeChapter(value: string) {
    this.props.controlVm.hide();
    this.props.controlVm.changeChapterAsync(value);
  }

  private _onChangePage(value: string) {
    let index = parseInt(value);
    this.props.controlVm.hide();
    this.props.pageVm.changeAsync(index);
  }
}
