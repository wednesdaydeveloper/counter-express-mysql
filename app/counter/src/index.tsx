import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Counter from './counter/Container';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import store from './Store';

ReactDOM.render(
  <Provider store={store}>
    <div>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Counter />
      </MuiThemeProvider>
    </div>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
