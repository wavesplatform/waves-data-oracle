import { Middleware, MiddlewareAPI, AnyAction } from 'redux';
import { OracleInfoActions, AppActions } from '../actions';
import {
    getOracleInfo as apiGetInfo,
    IOracleInfo,
    IServiceResponse,
    STATUSES
} from '../services/dataTransactionService';
import { middlewareFabric } from './utils';

export const getOracleInfo: Middleware = middlewareFabric<MiddlewareAPI, AnyAction>(OracleInfoActions.Type.GET_INFO)((store) => {
    const state = store.getState();
    const { account } = state;
    apiGetInfo(account.address, account.server)
        .then(oracleInfo => {
            oracleInfo.status
        });
});



const parseoracleInfoResponse = (response: IServiceResponse<IOracleInfo>) => {
     const { status, data, errors: oracleErrors } = response;
     const oracleInfo = { ...data, status, oracleErrors};
};
