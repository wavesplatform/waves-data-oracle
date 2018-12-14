import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps, Redirect } from 'react-router';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';
import { UserActions, AppActions } from 'app/actions';
import { Content } from './Content';
import './login.less';
import { notification, Row, Col } from 'antd';
import * as content from './content.json';

const Description: React.StatelessComponent<any> = ({ messageConf }) => {
    return (
        <div>
            <Row>
                <Col>
                    <div>{messageConf.actionText}</div>
                    {messageConf.help ? <div>
                        <a href={messageConf.help} target='_blank'>more info</a>
                    </div> : null}
                </Col>
            </Row>
        </div>
    );
};

export namespace Login {
    export interface Props extends RouteComponentProps<void> {
        actions: UserActions&AppActions;
        user: RootState.UserState;
        app: RootState.AppState;
    }
}

@connect(
    (state: RootState): Pick<Login.Props, 'app' & 'user'> => {
        return { app: state.app, user: state.user };
    },
    (dispatch: Dispatch): Pick<Login.Props, 'actions'> => ({
        actions: {
            ...bindActionCreators(omit(UserActions, 'Type'), dispatch),
            ...bindActionCreators(omit(AppActions, 'Type'), dispatch),
        }
    })
)
export class Login extends React.Component<Login.Props> {
    
    private loginHandler = () => this.onLogin();
    
    componentWillMount(): void {
        this.props.actions.logout();
    }
    
    render() {
        const { app } = this.props;
        
        if (app.isAuthenticated) {
            return <Redirect to={'/oracle'}/>;
        }
        
        return (
            <div className="login">
                <Content onLogin={this.loginHandler} app={app}/>
            </div>
        );
    }
    
    componentWillUpdate(nextProps: Readonly<Login.Props>): void {
        const { kepperError } = nextProps.app;
        
        if (kepperError) {
            const messageConf = (content as any).errors[kepperError.code];
            const notifyData = <Description messageConf={messageConf}/>;
            notification.error({
                message: messageConf.message,
                description: notifyData,
                key: kepperError.code.toString(10)
            });
            
            this.props.actions.setKeeperError(null);
            return;
        }
    }
    
    onLogin() {
        this.props.actions.login();
    }
    
}
