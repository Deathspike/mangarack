import * as React from 'react';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {chapterControlStyle} from './styles/chapterControlStyle';

// TODO: Manga|Manhwa|Manhua
// TODO: Select must use secondary color.
export class ChapterControlView extends React.Component {
  render() {
    return (
      <mui.AppBar color="secondary">
        <mui.Toolbar>
          <mui.IconButton color="inherit" style={chapterControlStyle.primaryButton}>
            <muiIcon.Close />
          </mui.IconButton>
          <mui.Select value={5} style={chapterControlStyle.chapterSelect} MenuProps={{PaperProps: {style: chapterControlStyle.menuPaper}}}>
            <mui.MenuItem value={0}>V01 #001</mui.MenuItem>
            <mui.MenuItem value={1}>V01 #002</mui.MenuItem>
            <mui.MenuItem value={2}>V01 #003</mui.MenuItem>
            <mui.MenuItem value={3}>V01 #004</mui.MenuItem>
            <mui.MenuItem value={4}>V01 #005</mui.MenuItem>
            <mui.MenuItem value={5}>V01 #006</mui.MenuItem>
            <mui.MenuItem value={6}>V01 #007</mui.MenuItem>
            <mui.MenuItem value={7}>V01 #008</mui.MenuItem>
            <mui.MenuItem value={8}>V01 #009</mui.MenuItem>
          </mui.Select>
          <mui.Select value={7} style={chapterControlStyle.pageSelect} MenuProps={{PaperProps: {style: chapterControlStyle.menuPaper}}} >
            <mui.MenuItem value={1}>Page 001</mui.MenuItem>
            <mui.MenuItem value={2}>Page 002</mui.MenuItem>
            <mui.MenuItem value={3}>Page 003</mui.MenuItem>
            <mui.MenuItem value={4}>Page 004</mui.MenuItem>
            <mui.MenuItem value={5}>Page 005</mui.MenuItem>
            <mui.MenuItem value={6}>Page 006</mui.MenuItem>
            <mui.MenuItem value={7}>Page 007</mui.MenuItem>
            <mui.MenuItem value={8}>Page 008</mui.MenuItem>
          </mui.Select>
          <mui.Select value={0} style={chapterControlStyle.directionSelect} MenuProps={{PaperProps: {style: chapterControlStyle.menuPaper}}}>
            <mui.MenuItem value={0}>Default Direction</mui.MenuItem>
            <mui.MenuItem value={1}>Right-To-Left</mui.MenuItem>
            <mui.MenuItem value={2}>Left-To-Right</mui.MenuItem>
          </mui.Select>
        </mui.Toolbar>
      </mui.AppBar>
    );
  }
}
