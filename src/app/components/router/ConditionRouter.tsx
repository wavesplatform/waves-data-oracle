import * as React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { StatelessComponent } from 'react';

interface Props extends RouteProps {
  condition: boolean;
  redirect: string;
}

export const ConditionRouter: StatelessComponent<Props> = ({ component, condition, redirect, children, ...rest }) => {
    if (!condition) {
      return  <Redirect to={redirect}/>;
    }
  
  return <Route {...rest} >{children}</Route>
};
