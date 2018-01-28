import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Material from 'material-ui';
import * as MaterialIcon from 'material-ui-icons';
import 'typeface-roboto';

function App() {
  return (
    <div>
      <Material.Reboot />
      <Material.Button raised color="primary">
        <MaterialIcon.Add />
        Hello World
      </Material.Button>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.querySelector('#container')
);
