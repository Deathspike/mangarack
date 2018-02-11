import * as React from 'react';
import * as mio from '../';
import * as mobxReact from 'mobx-react';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {chapterControlStyle} from './styles/chapterControlStyle';

// TODO: Manga|Manhwa|Manhua
// TODO: Select must use secondary color.
@mobxReact.observer
export class ChapterControlView extends React.Component<{vm: mio.ChapterControlViewModel}> {
  render() {
    return this.props.vm.visible && (
      <mui.AppBar color="secondary">
        <mui.Toolbar>
          <mui.IconButton color="inherit" onClick={() => this.props.vm.close()} style={chapterControlStyle.primaryButton}>
            <muiIcon.Close />
          </mui.IconButton>
          <mui.Select onChange={e => this.props.vm.changeChapterAsync(e.target.value)} value={this.props.vm.chapterName} style={chapterControlStyle.chapterSelect}>
            {this.props.vm.seriesChapters.map(seriesChapter => <mui.MenuItem key={seriesChapter.name} value={seriesChapter.name}>{seriesChapter.shortName}</mui.MenuItem>)}
          </mui.Select>
          <mui.Select value={7} style={chapterControlStyle.pageSelect}>
            <mui.MenuItem value={1}>Page 001</mui.MenuItem>
            <mui.MenuItem value={2}>Page 002</mui.MenuItem>
            <mui.MenuItem value={3}>Page 003</mui.MenuItem>
            <mui.MenuItem value={4}>Page 004</mui.MenuItem>
            <mui.MenuItem value={5}>Page 005</mui.MenuItem>
            <mui.MenuItem value={6}>Page 006</mui.MenuItem>
            <mui.MenuItem value={7}>Page 007</mui.MenuItem>
            <mui.MenuItem value={8}>Page 008</mui.MenuItem>
          </mui.Select>
          <mui.Select value={0} style={chapterControlStyle.directionSelect}>
            <mui.MenuItem value={0}>Default Direction</mui.MenuItem>
            <mui.MenuItem value={1}>Right-To-Left</mui.MenuItem>
            <mui.MenuItem value={2}>Left-To-Right</mui.MenuItem>
          </mui.Select>
        </mui.Toolbar>
      </mui.AppBar>
    );
  }
}
