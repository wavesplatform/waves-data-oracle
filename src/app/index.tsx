import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { PrivateRoute } from './components';
import { OracleApp } from 'app/containers/Oracle';
import { Login } from 'app/containers/Login';
import { hot } from 'react-hot-loader';
import { RootState } from 'app/reducers';
import 'app/styles/main.less';
import 'app/styles/icons.less';
import 'app/styles/fonts.less';

interface IProps {
    app?: RootState.AppState,
    router?: any,
}

const stateToProps = (state: RootState): IProps => {
    return { app: state.app, router: state.router };
};

const AppComponent: React.StatelessComponent<IProps> = (props) => {
    const { isAuthenticated } = props.app as RootState.AppState;
    return (
        <Switch>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/oracle" component={OracleApp} isAuthenticated={isAuthenticated}/>
            <Redirect to='/login'/>
        </Switch>
    );
};

export const App = hot(module)(withRouter(connect(stateToProps)(AppComponent) as any));
