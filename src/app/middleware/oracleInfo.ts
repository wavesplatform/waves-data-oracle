import { AnyAction, Middleware, MiddlewareAPI } from 'redux';
import { OracleInfoActions } from '../actions';
import { ORACLE_STATUS, OracleInfoModel } from 'app/models';
import {
    getOracleInfo as apiGetInfo,
    IOracleInfo,
    IServiceResponse,
    STATUSES
} from '../services/dataTransactionService';
import { middlewareFabric } from './utils';


export const getOracleInfo: Middleware = middlewareFabric<MiddlewareAPI, AnyAction>(OracleInfoActions.Type.GET_INFO)((store) => {
    const state = store.getState();
    const { user } = state;

    store.dispatch(OracleInfoActions.setOracleInfoStatus(ORACLE_STATUS.LOADING));
    apiGetInfo(user.address, user.server)
        .then(oracleInfo => {
            const infoData = parseOracleInfoResponse(oracleInfo);
            store.dispatch(OracleInfoActions.setOracleInfo(infoData));
        }).catch((e) => {
        console.log(e);
        store.dispatch(OracleInfoActions.setOracleInfoStatus(ORACLE_STATUS.SERVER_ERROR));
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
