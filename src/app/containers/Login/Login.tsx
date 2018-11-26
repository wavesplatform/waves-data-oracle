import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps, Redirect } from 'react-router';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';
import { UserActions } from 'app/actions';
import { Layout } from '../../components';
import { Content } from './Content';
import { Icon, Menu } from 'antd';

export namespace Login {
  export interface Props extends RouteComponentProps<void> {
    actions: UserActions;
    user: RootState.UserState;
  }
}

@connect(
  (state: RootState): Pick<Login.Props, 'user'> => {
    return { user: state.user };
  },
  (dispatch: Dispatch): Pick<Login.Props, 'actions'> => ({
    actions: bindActionCreators(omit(UserActions, 'Type'), dispatch)
  })
)
export class Login extends React.Component<Login.Props> {
  
  private loginHandler = () => this.onLogin();
  
  render() {
    
    if (!!this.props.user.publicKey) {
      return <Redirect to={'/assets'}/>
    }
    
    const props = {
      menu: <LoginMenu/>,
      content: <Content onLogin={this.loginHandler}/>,
      options: <div>Options</div>,
      showMenu: true,
      showOptions: true,
      menuCollapsed: false,
      optionsCollapsed: true,
      theme: 'light' as 'light'
    };
    
    return (
      <div>
        <Layout {...props}/>
      </div>
    );
  }
  
  onLogin() {
    this.props.actions.login();
  }
  
}

const LoginMenu = () => {
  return <div>
    <Menu
      mode="inline"
      theme="dark"
    >
      <Menu.Item key="1">
        <Icon type="login"/>
        <span>Login</span>
      </Menu.Item>
    </Menu>
  </div>;
};
