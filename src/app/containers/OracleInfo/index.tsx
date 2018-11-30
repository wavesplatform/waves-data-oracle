import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { UserActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';
import LayoutComponent from 'app/components/layout/Layout';
import { OracleMenu } from 'app/containers/Menu/Menu';


export namespace OracleInfo {
  export interface Props extends RouteComponentProps<void> {
    user: RootState.UserState;
    assets: RootState.AssetsState;
    actions: UserActions;
  }
}

@connect(
  (state: RootState): Pick<OracleInfo.Props, 'user'> => {
    return { user: state.user };
  },
  (dispatch: Dispatch): Pick<OracleInfo.Props, 'actions'> => ({
    actions: bindActionCreators(omit(UserActions, 'Type'), dispatch)
  })
)
export class OracleInfo extends React.Component<OracleInfo.Props> {
  
  static defaultProps: Partial<OracleInfo.Props> = {};
  
  render() {
    
    const menu = <OracleMenu history={this.props.history}/>;
      const header = <div>Tokens Verify</div>;
      const content = <div>Form</div>;
    
    return (
      <LayoutComponent leftSider={menu} content={content} header={header}/>
    );
  }
}
