import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { OracleInfoActions } from 'app/actions';
import { OracleInfoModel, ORACLE_STATUS } from 'app/models';

const initialState: RootState.OracleInfoState = {
    description: {},
    logo: '',
    name: '',
    site: '',
    mail: '',
    status: ORACLE_STATUS.LOADING
};

export const OracleInfosReducer = handleActions<RootState.OracleInfoState, Partial<OracleInfoModel>>(
    {
        [OracleInfoActions.Type.SET_INFO]: (state, action) => {
            return <OracleInfoModel>{ ...state, ...action.payload };
        },
        [OracleInfoActions.Type.SET_STATUS]: (state, action) => {
            return <OracleInfoModel>{ ...state, ...action.payload };
        },
    },
    
    initialState
);
