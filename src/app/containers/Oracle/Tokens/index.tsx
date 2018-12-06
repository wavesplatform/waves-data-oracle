import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { UserActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';
import TokensList from './TokensList';
import { Layout } from 'antd';
//import { ConditionRouter } from 'app/components/router/ConditionRouter';


export namespace Tokens {
    export interface Props extends RouteComponentProps<void> {
        user: RootState.UserState;
        actions: UserActions;
    }
}


const { Content } = Layout;

@connect(
    (state: RootState): Pick<Tokens.Props, 'user'> => {
        return { user: state.user };
    },
    (dispatch: Dispatch): Pick<Tokens.Props, 'actions'> => ({
        actions: bindActionCreators(omit({ ...UserActions }, 'Type'), dispatch)
    })
)
export class Tokens extends React.Component<Tokens.Props> {
    
    render() {
        const component = () => <div>test</div>;
        
        return (
            <Layout>
                <Content>
                    <Switch>
                        <Route path="/oracle/tokens" exact component={TokensList}/>
                        <Route path="/oracle/tokens/create" exact component={component}/>
                        <Route path="/oracle/tokens:assetId" component={component}/>
                    </Switch>
                </Content>
            </Layout>
        );
    }
}

