import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { UserActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { omit } from 'app/utils';

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    user: RootState.UserState;
    assets: RootState.AssetsState;
    actions: UserActions;
  }
}

@connect(
  (state: RootState, ownProps): Pick<App.Props, 'user'> => {
    return { user: state.user };
  },
  (dispatch: Dispatch): Pick<App.Props, 'actions'> => ({
    actions: bindActionCreators(omit(UserActions, 'Type'), dispatch)
  })
)
export class App extends React.Component<App.Props> {
  static defaultProps: Partial<App.Props> = {
  };


  render() {
    return (
      <div>
        ASSETS TABLE
      </div>
    );
  }
}
