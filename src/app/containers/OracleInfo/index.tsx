import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { UserActions, OracleInfoActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';
import LayoutComponent from 'app/components/layout/Layout';
import { OracleMenu } from 'app/containers/Menu/Menu';
import { Loading } from './Loading/Loading';
import { Redirect, Route, Switch } from 'react-router';


export namespace OracleInfo {
    export interface Props extends RouteComponentProps<void> {
        user: RootState.UserState;
        assets: RootState.AssetsState;
        actions: UserActions & OracleInfoActions;
    }
}

@connect(
    (state: RootState): Pick<OracleInfo.Props, 'user'> => {
        return { user: state.user };
    },
    (dispatch: Dispatch): Pick<OracleInfo.Props, 'actions'> => ({
        actions: bindActionCreators(omit({ ...UserActions, ...OracleInfoActions }, 'Type'), dispatch)
    })
)
export class OracleInfo extends React.Component<OracleInfo.Props> {
    
    static defaultProps: Partial<OracleInfo.Props> = {};
    
    componentWillMount(): void {
        this.props.actions.getOracleInfo();
    }
    
    render() {
        const { address, name } = this.props.user;
        const menu = <OracleMenu history={this.props.history} address={address} name={name}/>;
        const header = <div>Tokens Verify</div>;
        const content = <Loading size="large" tip="loading"/>;
        
        return (
          <LayoutComponent leftSider={menu} header={header}>
              <Switch>
                  <Route path="/oracle" component={Loading}/>
                  <Route/>
                  <Route/>
              </Switch>
              {content}
          </LayoutComponent>
        );
    }
}
