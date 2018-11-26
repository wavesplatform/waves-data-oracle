import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import { PrivateRoute } from './components';
import { App as OracleApp } from 'app/containers/App';
import { Login } from 'app/containers/Login';
import { hot } from 'react-hot-loader';
import { RootState } from 'app/reducers';

interface IProps {
  user?: RootState.UserState
}

const stateToProps = (state: RootState): IProps => {
  return { user: state.user };
};

const AppComponent: React.StatelessComponent<IProps> = ({ user }: IProps) => {
  const userModel = { ...user as RootState.UserState };
  return <Switch>
    <Route path="/login" component={Login}/>
    <PrivateRoute path="/assets" component={OracleApp} isAuthenticated={!!(userModel.publicKey)}/>
    <Redirect to='/login'/>
  </Switch>
};

export const App = hot(module)(connect(stateToProps)(AppComponent));
