import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { UserActions, OracleInfoActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';
import LayoutComponent from 'app/components/layout/Layout';
import { OracleMenu } from 'app/containers/Menu/Menu';
import { Loading } from './Loading/Loading';
import { OracleInfo as OracleInfoForm } from 'app/containers/OracleInfo/edit/OracleInfoEdit';
import { OracleTitle } from './OracleTitle/OracleTitle';


export namespace OracleInfo {
    export interface Props extends RouteComponentProps<void> {
        user: RootState.UserState;
        actions: UserActions & OracleInfoActions;
        oracleInfo: RootState.OracleInfoState
    }
}

@connect(
    (state: RootState): Pick<OracleInfo.Props, 'user' & 'oracleInfo'> => {
        return { user: state.user, oracleInfo: state.oracleInfo };
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
        const { oracleInfo } = this.props;
        const menu = <OracleMenu history={this.props.history} address={address} name={name}/>;
        const header = <OracleTitle status={oracleInfo.status}/>;
    
        return (
            <LayoutComponent leftSider={menu} header={header}>
                <Switch>
                    <Route path="/oracle" exact><Loading status={oracleInfo.status}/></Route>
                    <Route path="/oracle/edit"><OracleInfoForm/></Route>
                    <Route path="/oracle/create"><OracleInfoForm/></Route>
                    <Route path="/oracle/error"><OracleInfoForm/></Route>
                    <Redirect to="/oracle"/>
                </Switch>
            </LayoutComponent>
        );
    }
}

