import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { PrivateRoute } from './components';
import { App as OracleApp } from 'app/containers/App';
import { Login } from 'app/containers/Login';
import { hot } from 'react-hot-loader';
import { RootState } from 'app/reducers';

interface IProps {
  app?: RootState.AppState,
  router?: any,
}

const stateToProps = (state: RootState): IProps => {
  return { app: state.app, router: state.router };
};

const AppComponent: React.StatelessComponent<IProps> = (props, context) => {
  const { isAuthenticated } = props.app as RootState.AppState;
  return <Switch>
    <Route path="/login" component={Login}/>
    <PrivateRoute path="/assets" component={OracleApp} isAuthenticated={isAuthenticated}/>
    <Redirect to='/login'/>
  </Switch>
};

export const App = hot(module)(withRouter(connect(stateToProps)(AppComponent) as any));
