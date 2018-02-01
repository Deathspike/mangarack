import * as React from 'react';
import * as mobxReact from 'mobx-react';
import * as mio from '../';
import * as mui from 'material-ui';
import * as muiIcon from 'material-ui-icons';
import * as rrd from 'react-router-dom';

// TODO: rrd.Link is <a>, weird styles on ListItem, better way?
@mobxReact.observer
export class SeriesView extends React.Component<{vm: mio.SeriesViewModel}> {
  componentWillMount() {
    this.props.vm.fetchAsync();
  }

  // TODO: handle .exists with icon and link (and button should give a warning modal)
  render() {
    let vm = this.props.vm;
    if (vm.chapters) {
      return (
        <mui.Paper>
          <mui.List>
            {vm.chapters.map(seriesChapterViewModel => (
              <rrd.Link key={seriesChapterViewModel.uniqueKey} to={seriesChapterViewModel.url}>
                <mui.ListItem button>
                  <mui.ListItemIcon>
                    <muiIcon.InsertDriveFile />
                  </mui.ListItemIcon>
                  <mui.ListItemText primary={seriesChapterViewModel.name} />
                </mui.ListItem>
              </rrd.Link>
            ))}
          </mui.List>
        </mui.Paper>
      )
    } else {
      // TODO: Center.
      return (
        <mui.Paper>
          <mui.CircularProgress />
        </mui.Paper>
      );
    }
  }
}
