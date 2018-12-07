import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { OracleTokensActions, AppActions } from 'app/actions';
import { TokensModel, TOKENS_STATUS} from 'app/models';

export const assetsInitState: RootState.TokensState = {
    content: [],
    status: TOKENS_STATUS.LOADING,
    saveStatus: null,
};

export const TokensReducer = handleActions<RootState.TokensState, Partial<TokensModel>>(
    {
        [OracleTokensActions.Type.SET_TOKENS]: (state, action) => {
            return <TokensModel>{ ...state, ...action.payload };
        },
        [OracleTokensActions.Type.SET_STATUS]: (state, action) => {
            return <TokensModel>{ ...state, status: action.payload };
        },
        [OracleTokensActions.Type.SET_SAVE_STATUS]: (state, action) => {
            return <TokensModel>{ ...state, saveStatus: action.payload };
        },
        [AppActions.Type.CLEAR_STORE]: () => {
            return <TokensModel>{ ...assetsInitState };
        },
    },
    
    assetsInitState
);
