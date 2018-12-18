import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { AppActions, OracleInfoActions } from 'app/actions';
import { OracleInfoModel, ORACLE_STATUS } from 'app/models';

export const oracleInfoInitialState: RootState.OracleInfoState = {
    content: {
        description: {},
        name: '',
        link: '',
        email: ''
    },
    status: ORACLE_STATUS.LOADING,
    saveStatus: null,
    errors: []
};

export const OracleInfosReducer = handleActions<RootState.OracleInfoState, Partial<OracleInfoModel>>(
    {
        [OracleInfoActions.Type.SET_DIFF]: (state, action) => {
            const content = { ...state.content, ...action.payload };
            return <OracleInfoModel>{ ...state, content };
        },
        [OracleInfoActions.Type.SET_INFO]: (state, action) => {
            return <OracleInfoModel>{ ...state, ...action.payload };
        },
        [OracleInfoActions.Type.SET_STATUS]: (state, action) => {
            return <OracleInfoModel>{ ...state, status: action.payload };
        },
        [OracleInfoActions.Type.SET_SAVE_STATUS]: (state, action) => {
            return <OracleInfoModel>{ ...state, saveStatus: action.payload };
        },
        [AppActions.Type.CLEAR_STORE]: () => {
            return <OracleInfoModel>{ ...oracleInfoInitialState };
        },
    },

    oracleInfoInitialState
);
