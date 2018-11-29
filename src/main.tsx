import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from 'app/store';
import { UserActions, AppActions } from 'app/actions';
import { userService } from 'app/services/KeeperService';
import { Router } from 'react-router';
import { App } from './app';
import './assets/index.less';

// prepare store
const history = createBrowserHistory();
const store = configureStore();

userService.onUpdate((state) => {
    const { user } = store.getState();
    const { account, locked, initialized } = state;
    if (locked || !initialized || !account || (user.address && user.address !== account.address)) {
        store.dispatch(AppActions.setKeeperError(null));
        store.dispatch(UserActions.logout());
    }
    
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
