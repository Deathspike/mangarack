import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as mio from './';
import * as rrd from 'react-router-dom';
import 'typeface-roboto';

// TODO: remove rrd and go for layering.
// TODO: web->client
// TODO: listitem overflow texts..
// TODO: chapter listing name is way too long for what's necessary.. V01 #001
// TODO: make an entry point for web, much like cli/server?
// TODO: the series page should be tabbed, info and chapters.
// TODO: export {
  
function App() {
  return (
    <div>
      <mui.Reboot />
      <rrd.HashRouter>
        <rrd.Switch>
          <rrd.Route path="/:providerName/:seriesName/:chapterName" component={mio.chapter.ChapterController} />
          <rrd.Route path="/:providerName/:seriesName" component={mio.series.SeriesController} />
          <rrd.Route path="/" component={mio.list.ListController} />
        </rrd.Switch>
      </rrd.HashRouter>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
