import { AnyAction, Middleware, MiddlewareAPI } from 'redux';
import { OracleInfoActions } from '../actions';
import { ORACLE_SAVE_STATUS, ORACLE_STATUS, OracleInfoModel } from 'app/models';
import {
    setOracleInfo as apiSetOracleInfo,
    getOracleData as apiGetInfo,
    IOracleInfo,
    IServiceResponse,
    STATUSES
} from '../services/dataTransactionService';
import { middlewareFabric as mwF } from './utils';


export const getOracleInfo: Middleware =
    mwF<MiddlewareAPI, AnyAction>(OracleInfoActions.Type.GET_INFO)((store) => {
    const state = store.getState();
    const { user } = state;

    store.dispatch(OracleInfoActions.setOracleInfoStatus(ORACLE_STATUS.LOADING));
    apiGetInfo(user.address, user.server)
        .then(oracleInfo => {
            const infoData = parseOracleInfoResponse(oracleInfo.oracle);
            store.dispatch(OracleInfoActions.setOracleInfo(infoData));
        }).catch((e) => {
        store.dispatch(OracleInfoActions.setOracleInfoStatus(ORACLE_STATUS.SERVER_ERROR));
    });
});

export const setOracleinfo: Middleware =
    mwF<MiddlewareAPI, AnyAction>(OracleInfoActions.Type.SAVE_INFO)((store, next, action) => {
        store.dispatch(OracleInfoActions.setOracleSaveStatus(ORACLE_SAVE_STATUS.LOADING));
        apiSetOracleInfo(action.payload).then(
            () => {
                store.dispatch(OracleInfoActions.setOracleSaveStatus(ORACLE_SAVE_STATUS.READY));
            }
        ).catch(() => {
            store.dispatch(OracleInfoActions.setOracleSaveStatus(ORACLE_SAVE_STATUS.SERVER_ERROR))
        });
});


const parseOracleInfoResponse = (response: IServiceResponse<IOracleInfo>): OracleInfoModel => {
    const { status, data, errors: oracleErrors = null } = response;

    switch (status) {
        case STATUSES.EMPTY:
            return { status: ORACLE_STATUS.EMPTY, ...data, oracleErrors };
        case STATUSES.ERROR:
            return { status: ORACLE_STATUS.HAS_ERROR, ...data, oracleErrors };
        case STATUSES.OK:
            return { status: ORACLE_STATUS.READY, ...data, oracleErrors };
    }
};
