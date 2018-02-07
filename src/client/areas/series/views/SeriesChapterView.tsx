import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import {seriesChapterStyle} from './styles/seriesChapterStyle';

@mobxReact.observer
export class SeriesChapterView extends React.Component<{vm: mio.SeriesChapterViewModel}> {
  render() {
    return (
      <mui.ListItem button onClick={() => this.props.vm.openAsync()}>
        <mui.ListItemIcon>
          {this.props.vm.downloaded ? <muiIcon.InsertDriveFile /> : <muiIcon.Cloud />}
        </mui.ListItemIcon>
        <mui.ListItemText primary={this.props.vm.name} style={seriesChapterStyle.listItemText} />
      </mui.ListItem>
    );
  }
}
