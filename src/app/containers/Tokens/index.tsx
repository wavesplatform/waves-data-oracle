import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { UserActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';
import LayoutComponent from 'app/components/layout/Layout';
import { OracleMenu } from 'app/containers/Menu/Menu';
//import { ConditionRouter } from 'app/components/router/ConditionRouter';


export namespace Tokens {
    export interface Props extends RouteComponentProps<void> {
        user: RootState.UserState;
        actions: UserActions;
        menu: OracleMenu;
    }
}

@connect(
    (state: RootState): Pick<Tokens.Props, 'user'> => {
        return { user: state.user };
    },
    (dispatch: Dispatch): Pick<Tokens.Props, 'actions'> => ({
        actions: bindActionCreators(omit({ ...UserActions }, 'Type'), dispatch)
    })
)
export class Tokens extends React.Component<Tokens.Props> {
    
    static defaultProps: Partial<Tokens.Props> = {};
    
    componentWillMount(): void {
        //this.props.actions.getOracleInfo();
    }
    
    render() {
        return (
            <LayoutComponent leftSider={this.props.menu}>
                <Switch>
                    <Route path="/oracle/tokens" exact>
                        <div>Tokens form</div>
                    </Route>
                    <Redirect to="/oracle/tokens"/>
                </Switch>
            </LayoutComponent>
        );
    }
}

