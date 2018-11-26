import * as React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { StatelessComponent } from 'react';

interface Props extends RouteProps {
  isAuthenticated: boolean;
  component: any;
}

export const PrivateRoute: StatelessComponent<Props> = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
);

PrivateRoute.defaultProps = {
  isAuthenticated: false,
};

