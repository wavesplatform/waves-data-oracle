import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { PrivateRoute } from './components';
import { App as OracleApp } from 'app/containers/App';
import { Login } from 'app/containers/Login';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <Switch>
    <Route path="/login" component={Login} />
    <PrivateRoute path="/assets" component={OracleApp} isAuthenticated={false}/>
    <Redirect to='/login' />
  </Switch>
));
