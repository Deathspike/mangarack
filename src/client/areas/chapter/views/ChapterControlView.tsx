import * as React from 'react';
import * as mio from '../';
import * as mobxReact from 'mobx-react';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {chapterControlStyle} from './styles/chapterControlStyle';

// [Improvement] Read direction selection (and respect ltr and rtl based on comic type).
// TODO: Select must use secondary color.
@mobxReact.observer
export class ChapterControlView extends React.Component<{chapterControlVm: mio.ChapterControlViewModel, chapterVm: mio.ChapterViewModel}> {
  render() {
    return this.props.chapterControlVm.visible && (
      <mui.AppBar color="secondary">
        <mui.Toolbar>
          <mui.IconButton color="inherit" onClick={() => this.props.chapterControlVm.close()} style={chapterControlStyle.primaryButton}>
            <muiIcon.Close />
          </mui.IconButton>
          <mui.Select onChange={e => this.props.chapterControlVm.changeChapterAsync(e.target.value)} value={this.props.chapterControlVm.chapterName} style={chapterControlStyle.chapterSelect}>
            {this.props.chapterControlVm.seriesChapters.map(seriesChapter => <mui.MenuItem key={seriesChapter.name} value={seriesChapter.name}>{seriesChapter.shortName}</mui.MenuItem>)}
          </mui.Select>
          <mui.Select onChange={e => this.props.chapterVm.changeAsync(e.target.value)} value={this.props.chapterVm.pageIndex} style={chapterControlStyle.pageSelect}>
            {this.props.chapterVm.pages.map(pageData => <mui.MenuItem key={pageData.index} value={pageData.index}>{pageData.name}</mui.MenuItem>)}
          </mui.Select>
        </mui.Toolbar>
      </mui.AppBar>
    );
  }
}
