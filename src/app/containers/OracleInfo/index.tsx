import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { UserActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';
import { Avatar } from '../../components/avatar';

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
  static defaultProps: Partial<OracleInfo.Props> = {
  };


  render() {
    return (
      <div>
        ASSETS TABLE
        <Avatar address={this.props.user.address} size={100}/>
      </div>
    );
  }
}
