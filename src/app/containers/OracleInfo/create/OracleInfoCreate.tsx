import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from 'app/reducers';

export namespace OracleInfoLoading {
  export interface Props {
    user: RootState.UserState;
    assets: RootState.AssetsState;
    actions: null;
  }
}

@connect(
  (state: RootState): Pick<OracleInfoLoading.Props, 'user'> => {
    return { user: state.user };
  },
  (dispatch: Dispatch): Pick<OracleInfoLoading.Props, 'actions'> => ({
    actions: null
  })
)
export class OracleInfo extends React.Component<OracleInfoLoading.Props> {
  static defaultProps: Partial<OracleInfoLoading.Props> = {
  };


  render() {
    return (
      <div>
        ASSETS INFO CREATE
      </div>
    );
  }
}
