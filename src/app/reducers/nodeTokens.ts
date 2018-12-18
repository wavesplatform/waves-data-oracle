import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { OracleTokensActions } from 'app/actions';

export const nodeTokensInitState: RootState.NodeTokensState = Object.create(null);

export const NodeTokensReducer = handleActions<RootState.NodeTokensState>(
    {
        [OracleTokensActions.Type.SET_TOKEN_NAME]: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
    
    nodeTokensInitState
);
