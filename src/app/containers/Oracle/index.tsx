import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { AppActions, UserActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';
import LayoutComponent from 'app/components/layout/Layout';
import { ConditionRouter } from 'app/components/router/ConditionRouter';
import { OracleMenu } from 'app/containers/Menu/Menu';
import { Loading } from './Loading/Loading';
import { OracleInfo as OracleInfoForm } from 'app/containers/Oracle/edit/OracleInfoEdit';
import { Tokens } from 'app/containers/Oracle/Tokens';
import { OracleTitle } from './OracleTitle/OracleTitle';
import { ErrorContent } from './ErrorContent/ErrorContent';
import { EmptyContent } from './EmptyContent/EmptyContent';
import { ORACLE_STATUS } from 'app/models';


export namespace OracleApp {
    export interface Props extends RouteComponentProps<void> {
        user: RootState.UserState;
        actions: UserActions & AppActions;
        oracleInfo: RootState.OracleInfoState
    }
}

@connect(
    (state: RootState): Pick<OracleApp.Props, 'user' & 'oracleInfo'> => {
        return { user: state.user, oracleInfo: state.oracleInfo };
    },
    (dispatch: Dispatch): Pick<OracleApp.Props, 'actions'> => ({
        actions: bindActionCreators(omit({ ...UserActions, ...AppActions }, 'Type'), dispatch)
    })
)
export class OracleApp extends React.Component<OracleApp.Props> {
    
    static defaultProps: Partial<OracleApp.Props> = {};
    
    reloadOracleInfo = () => {
        this.props.history.replace('/oracle');
        this.props.actions.getOracleData();
    };
    
    goToCreateHandler = () => {
        this.props.history.replace('/oracle/create');
    };
    
    componentWillMount(): void {
        this.props.actions.getOracleData();
    }
    
    render() {
        const { address, name } = this.props.user;
        const { oracleInfo } = this.props;
        const path = this.props.history.location.pathname;
        const menu = <OracleMenu path={path} history={this.props.history} address={address} name={name}/>;
        const header = <OracleTitle status={oracleInfo.status}/>;
        
        return (
            <LayoutComponent leftSider={menu} header={header}>
                <Switch>
                    <Route path="/oracle" exact>
                        <Loading status={oracleInfo.status}/>
                    </Route>
                    
                    <ConditionRouter condition={oracleInfo.status === ORACLE_STATUS.EMPTY}
                                     redirect="/oracle"
                                     path="/oracle/empty">
                        <EmptyContent toCreate={this.goToCreateHandler}/>
                    </ConditionRouter>
                    
                    <ConditionRouter condition={oracleInfo.status !== ORACLE_STATUS.EMPTY}
                                     redirect="/oracle"
                                     path="/oracle/edit">
                        <OracleInfoForm/>
                    </ConditionRouter>
                    
                    <ConditionRouter path="/oracle/create"
                                     condition={oracleInfo.status === ORACLE_STATUS.EMPTY}
                                     redirect="/oracle">
                        <OracleInfoForm/>
                    </ConditionRouter>
                    
                    <ConditionRouter path="/oracle/error"
                                     condition={oracleInfo.status === ORACLE_STATUS.SERVER_ERROR}
                                     redirect="/oracle">
                        <ErrorContent onReload={this.reloadOracleInfo}/>
                    </ConditionRouter>
                    
                    <Route path="/oracle/tokens" component={Tokens}/>
                    
                    <Redirect to="/oracle"/>
                </Switch>
            </LayoutComponent>
        );
    }
}

