import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { OracleTokensActions } from 'app/actions';
import { OracleInfoModel, ORACLE_STATUS } from 'app/models';

export const oracleInfoInitialState: RootState.OracleInfoState = {
    description: {},
    logo: '',
    name: '',
    site: '',
    mail: '',
    status: ORACLE_STATUS.LOADING,
    saveStatus: null,
    oracleErrors: {},
};

export const OracleInfosReducer = handleActions<RootState.OracleInfoState, Partial<OracleInfoModel>>(
    {
        [OracleInfoActions.Type.SET_INFO]: (state, action) => {
            return <OracleInfoModel>{ ...state, ...action.payload };
        },
        [OracleInfoActions.Type.SET_STATUS]: (state, action) => {
            return <OracleInfoModel>{ ...state, status: action.payload };
        },
        [OracleInfoActions.Type.SET_SAVE_STATUS]: (state, action) => {
            return <OracleInfoModel>{ ...state, saveStatus: action.payload };
        },
    },
    
    oracleInfoInitialState
);
